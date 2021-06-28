/*
import { useEffect } from "react"
import { useState } from "react"
import { database } from "../services/firebase"

type FirebaseUserOptions = Record<string, {
  showAnseweredQuestionsInfo: boolean
}>

type UserOptionsType = {
  showAnseweredQuestionsInfo: boolean
}
*/

export function useOptions(userId: string) {
  /* const [userOptions, setUserOptions] = useState<UserOptionsType>()

  useEffect(() => {
    const userOptionsRef = database.ref(`options/${userId}`)
    console.log('userOptionsRef', userOptionsRef)

    userOptionsRef.on('value', userOptions => {
      console.log('userOptions:', userOptions)
      
      const databaseUserOptions = userOptions.val()
      console.log('databaseUserOptions:', databaseUserOptions)
      
      const firebaseUserOptions: FirebaseUserOptions = databaseUserOptions ?? {}
      console.log('firebaseUserOptions:', firebaseUserOptions)

      setUserOptions(databaseUserOptions ?? {})
    })

    return () => {
      userOptionsRef.off('value')
    }
  }, [userId])

  return { userOptions }
  */
  return { userOptions: {
    showAnseweredQuestionsInfo: false
    //showAnseweredQuestionsInfo: true
  }}
}