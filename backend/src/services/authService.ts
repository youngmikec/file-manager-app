import { prisma } from "../config/db/client.js";
import { AppError } from "../helpers/error.js";
import { generateAccessToken, hashPassword, verifyPassword } from "../helpers/password.js";
import type { AuthRequest } from "../validationSchemas/index.js";


export const registerUserService = async (data: AuthRequest) => {
    try {
        const { email, password } = data;
        const existingUser = await prisma.user.findUnique({ where: { email }});

        if (existingUser) {
            throw new AppError(400, 'Account Exist', 'This User Account Already Exist');
        }
        const hashedpassword = await hashPassword(password);
        const { user } = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedpassword
                }
            });

            if (user) {
                const folder = await tx.folder.create({
                    data: {
                        name: "My Drive",
                        ownerId: user.id,
                        parentId: null,
                        createdAt: new Date()
                    }
                });
            }
            
            return { user };
        });

        if (!user) {
            throw new AppError(500, 'SEVER_ERROR', 'An Error occurred while registering account');
        }

        const {accessToken} = generateAccessToken(user);

        return {
            user,
            accessToken
        };
    } catch (error: any) {
        if (error instanceof AppError) {
            throw new AppError(error.statusCode, error.code, error.message);
        }
    }
}

export const loginUserService = async (data: AuthRequest) => {
    try {
        const { email, password } = data;
        const existingUser = await prisma.user.findUnique({ where: { email }});

        if (!existingUser) {
            throw new AppError(404, 'NOT_FOUND', 'User account not found');
        }
        const isValidPassword = await verifyPassword(password, existingUser.password);
        if (!isValidPassword) {
            throw new AppError(400, 'INVALID_CRENDENTAIL', 'Incorrect Password');
        }

        const { accessToken } = generateAccessToken(existingUser);

        return {
            user: {
                email: existingUser.email,
                id: existingUser.id,
                createdAt: existingUser.createdAt,
                updatedAt: existingUser.updatedAt
            },
            accessToken
        };

    } catch (error: any) {
        throw new AppError(500, 'SERVER_ERROR', error.message);
    }
}