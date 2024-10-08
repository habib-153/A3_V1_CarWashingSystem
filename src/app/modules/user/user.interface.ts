export type TRole = 'admin' | 'user' 

export type TUser = {
    name: string
    email: string
    image?: string
    password: string
    phone: string
    role: TRole
    address: string
}