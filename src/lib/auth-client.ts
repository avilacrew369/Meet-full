import {createAuthClient } from 'better-auth/react'

export const {signOut, useSession, revokeSession, revokeSessions} = createAuthClient()