'use client'

import Link from 'next/link'
import React from 'react'

export default function page({params} : any) {

  console.log(params)

  return (
    <>
    <div>
        <Link href="/home">
            <button>Accueil</button>
        </Link>
    </div>
    <div>Image</div>
    <div>Du texte</div>
    <div>Copier le texte</div>
    </>
  )
}
