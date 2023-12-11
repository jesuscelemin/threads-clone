'use client'

import { EditProfileProps } from '@/types'
import Profile from '../forms/Profile'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'

const EditProfile = ({ user }: EditProfileProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="small-regular cursor-pointer rounded-md border border-light-100 px-4 py-2 text-light-100">
          Editar Perfil
        </div>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border-light-400 bg-dark-100 p-8 text-light-100 shadow">
          <DialogHeader>
            <DialogTitle className="mb-2">
              <h2 className="h1-bold ">Editar Perfil</h2>
            </DialogTitle>
          </DialogHeader>
          <Profile user={user} btnTitle="Guardar" />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
export default EditProfile
