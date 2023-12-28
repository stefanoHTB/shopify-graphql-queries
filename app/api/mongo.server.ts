// import { PrismaClient, CustomerCreateInput } from '@prisma/client';

export const createUser = async ({ email, name }: any) => {

    return await prisma.customer.create({
        data: {
            id: '12345',
            email: email,
            name: name

        } as any
})};




  