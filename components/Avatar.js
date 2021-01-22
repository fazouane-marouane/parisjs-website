import Image from 'next/image'
import { useState } from 'react'
import { MdPerson } from 'react-icons/md'

function Avatar({ imageUrl, name, size }) {
  const [showDefaultAvatar, setShowDefaultAvatar] = useState(!imageUrl)
  return (
    <div className={`Avatar ${size === 'small' && 'Avatar--small'}`}>
      {showDefaultAvatar ? (
        <MdPerson color="#8E9599" size={18} className="Avatar__icon" />
      ) : (
        <img
          src={imageUrl}
          alt={name}
          onError={() => setShowDefaultAvatar(true)}
          className="Avatar__image"
        />
      )}
    </div>
  )
}

export default Avatar
