"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  useUser, 
  useFirestore, 
  useDoc, 
  useAuth as useFirebaseAuth,
  useMemoFirebase,
  initiateEmailSignIn,
  initiateAnonymousSignIn
} from "@/firebase"
import { doc, setDoc, serverTimestamp, collection, getDocs, writeBatch, query, limit } from "firebase/firestore"
import { signOut } from "firebase/auth"

export type UserRole = "student" | "teacher" | "admin" | "registrar" | null

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  lastLoginDate: any
  preferredTheme: string
  profileImageUrl?: string
}

interface AuthContextType {
  user: UserProfile | null
  login: (role: UserRole) => void
  emailLogin: (email: string, pass: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const SHS_SUBJECTS = [
  { id: "KUM101", courseCode: "KUM101", title: "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino", credits: 4, description: "Pag-aaral tungo sa pananaliksik ukol sa kalikasan, katangian, at gamit ng wikang Filipino." },
  { id: "GENMATH", courseCode: "GENMATH", title: "General Mathematics", credits: 4, description: "Functions and their graphs, business mathematics, and logic." },
  { id: "ORALCOM", courseCode: "ORALCOM", title: "Oral Communication", credits: 4, description: "Development of listening and speaking skills and strategies for effective communication." },
  { id: "P6-1", courseCode: "P6-1", title: "General Physics 1", credits: 4, description: "Mechanics of particles, rigid bodies, and fluids." },
  { id: "EMP-TECH", courseCode: "EMP-TECH", title: "Empowerment Technologies", credits: 3, description: "ICT as a tool for curating, contextualizing, collaborating, and creating content." },
]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: firebaseUser, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useFirebaseAuth()
  const router = useRouter()

  const userDocRef = useMemoFirebase(() => {
    if (!db || !firebaseUser) return null
    return doc(db, "users", firebaseUser.uid)
  }, [db, firebaseUser])

  const { data: profile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef)

  const isLoading = isUserLoading || (!!firebaseUser && isProfileLoading)

  const login = (role: UserRole) => {
    localStorage.setItem("pending-role", role || "student")
    initiateAnonymousSignIn(auth)
  }

  const emailLogin = (email: string, pass: string) => {
    initiateEmailSignIn(auth, email, pass)
  }

  // Provision initial subjects and classes if they don't exist
  React.useEffect(() => {
    async function provisionData() {
      if (!db) return
      
      const coursesSnap = await getDocs(query(collection(db, "courses"), limit(1)))
      if (coursesSnap.empty) {
        const batch = writeBatch(db)
        SHS_SUBJECTS.forEach(s => {
          const ref = doc(db, "courses", s.id)
          batch.set(ref, s)
        })
        await batch.commit()
        
        // Provision classes for these courses
        const classBatch = writeBatch(db)
        SHS_SUBJECTS.forEach((s, idx) => {
          const classId = `CLASS-${s.id}`
          const classRef = doc(db, "classes", classId)
          classBatch.set(classRef, {
            id: classId,
            courseId: s.id,
            teacherId: "PROVISIONED_TEACHER",
            academicYearId: "2024-2025",
            sectionName: "Grade 12 - STEM A",
            location: "Building A, Room " + (100 + idx),
            maxCapacity: 40,
            currentEnrollmentCount: 1
          })

          // Add schedules for each class
          DAYS.forEach((day, dIdx) => {
            const schedId = `SCHED-${classId}-${day}`
            const schedRef = doc(db, "classes", classId, "schedules", schedId)
            classBatch.set(schedRef, {
              id: schedId,
              classId: classId,
              dayOfWeek: day,
              startTime: `${7 + idx}:00`,
              endTime: `${8 + idx}:00`,
              roomNumber: "Room " + (100 + idx),
              classTeacherId: "PROVISIONED_TEACHER" // Critical for rules
            })
          })
        })
        await classBatch.commit()
      }
    }
    provisionData()
  }, [db])

  React.useEffect(() => {
    if (firebaseUser && !isProfileLoading) {
      if (!profile) {
        const role = (localStorage.getItem("pending-role") as UserRole) || "student"
        const firstName = role.charAt(0).toUpperCase() + role.slice(1)
        const lastName = "Account"
        const uid = firebaseUser.uid
        
        const newProfile: UserProfile = {
          id: uid,
          email: firebaseUser.email || `${role}@seniorhigh.edu.ph`,
          firstName,
          lastName,
          role: role,
          lastLoginDate: serverTimestamp(),
          preferredTheme: "light",
          profileImageUrl: `https://picsum.photos/seed/${uid}/200/200`,
        }

        setDoc(doc(db, "users", uid), newProfile, { merge: true })

        if (role === 'student') {
          setDoc(doc(db, "student_profiles", uid), {
            id: uid,
            userId: uid,
            studentIdNumber: `LRN-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
            strand: "STEM",
            gradeLevel: "12",
            section: "A",
            dateOfBirth: "2007-06-20",
            currentGwa: 92.5
          }, { merge: true })

          // Enroll student in all provisioned classes
          const enrollBatch = writeBatch(db)
          SHS_SUBJECTS.forEach(s => {
            const classId = `CLASS-${s.id}`
            const enrollId = `ENROLL-${uid}-${classId}`
            enrollBatch.set(doc(db, "enrollments", enrollId), {
              id: enrollId,
              studentProfileId: uid,
              classId: classId,
              enrollmentDate: new Date().toISOString(),
              status: "enrolled",
              classTeacherId: "PROVISIONED_TEACHER"
            })
          })
          enrollBatch.commit()

        } else if (role === 'teacher') {
          setDoc(doc(db, "teacher_profiles", uid), {
            id: uid,
            userId: uid,
            employeeIdNumber: `DEPED-${Math.floor(100000 + Math.random() * 900000)}`,
            department: "Mathematics and Science"
          }, { merge: true })
        } else if (role === 'admin' || role === 'registrar') {
          const col = role === 'admin' ? "admin_profiles" : "registrar_profiles"
          setDoc(doc(db, col, uid), {
            id: uid,
            userId: uid,
            idNumber: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
          }, { merge: true })
        }
        
        localStorage.removeItem("pending-role")
      }
      router.push("/dashboard")
    }
  }, [firebaseUser, profile, isProfileLoading, db, router])

  const logout = () => {
    signOut(auth).then(() => {
      router.push("/")
    })
  }

  const value = {
    user: profile,
    login,
    emailLogin,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}