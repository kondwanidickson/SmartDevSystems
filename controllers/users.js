import { createRequire } from 'module'
import { addDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { Users, queryRef, docRef, imgref, getDownloadURL } from '../config/firebase.js'

const require = createRequire(import.meta.url);
const asyncHandler = require('express-async-handler')

const get_me = asyncHandler( async (req, res) => {
    try {
        const { uid } = req.params

        if (!uid) {
            res.status(400).json({ type: 'error', message: 'User not unauthorized' })
            return
        }

        const users = await getDocs(queryRef("users", "uid", uid));

        if (!users.empty) {
            res.status(200).json({ type: "success", me: { id: users.docs[0].id, ...users.docs[0].data() } })
            return
        }

        res.status(200).json({ type: 'error', message: 'Account setup not finished' })
    } catch (error) {
        res.status(400).json({ type: 'error', message: 'Network error' })
        throw new Error(error.message)
    }
})

// const upgrade_account = asyncHandler( async (req, res) => {
//     try {
//         const { uid, firstname, lastname, email, location, features } = req.body

//         if (!uid || !firstname || !lastname || !email || !location || !features) {
//             res.status(400).json({ type: 'error', message: 'Input fields are invalid' })
//             return
//         }

//         const _features = {
//             types: uid === process.env.UID || uid === process.env.UID1 ? (
//                 features.length < 1 ? 
//                 [
//                     {
//                         name: 'sl-administrator'
//                     }
//                 ] : 
//                 [
//                     {
//                         name: 'sl-administrator'
//                     },
//                     {
//                         name: 'freelancer',
//                         categories: features.map((feature)=>({
//                             label: feature.label,
//                             content: feature.content
//                         }))
//                     }
//                 ]
//             )
//             : (
//                 features.length < 1 ? 
//                 [
//                     {
//                         name: 'general'
//                     }
//                 ] : 
//                 [
//                     {
//                         name: 'general'
//                     },
//                     {
//                         name: 'freelancer',
//                         categories: features.map((feature)=>({
//                             label: feature.label,
//                             content: feature.content
//                         }))
//                     }
//                 ]
//             )
//         }

//         const exist = await getDocs(queryRef("users", "uid", uid));

//         if (!exist.empty) {
//             await updateDoc(docRef("users", exist.docs[0].id), { 
//                 uid, 
//                 firstname, 
//                 lastname, 
//                 email, 
//                 location, 
//                 features: _features 
//             }).then(()=>{
//                 res.status(200).json({ type: 'success', message: 'Your account has been upgraded successfully' })
//             }).catch((error)=>{
//                 res.status(400).json({ type: 'error', message: 'Failed to upgrade your account' })
//                 throw new Error(error.message)
//             })
//         } else {
//             await addDoc(Users, { 
//                 uid, 
//                 firstname, 
//                 lastname, 
//                 email, 
//                 location, 
//                 features: _features 
//             }).then(()=>{
//                 res.status(200).json({ type: 'success', message: 'Your account has been upgraded successfully' })
//             }).catch((error)=>{
//                 res.status(400).json({ type: 'error', message: 'Failed to upgrade your account' })
//                 throw new Error(error.message)
//             })
//         }
//     } catch (error) {
//         res.status(400).json({ type: 'error', message: 'Network error' })
//         throw new Error(error.message)
//     }
// })

export {
    get_me,
    // upgrade_account
}