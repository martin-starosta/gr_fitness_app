import { ROLE } from "../utils/enums";
import {
    ADMIN_USER_ATTRIBUTES,
    PUBLIC_USER_ATTRIBUTES,
} from "../config/constants";

import { models } from "../db";
import { TUser } from "../types";

const { User, Exercise, ComletedExercise } = models;

export async function getUsers(role: ROLE) {
    let users = [];
    switch (role) {
        case ROLE.ADMIN:
            users = await User.findAll({
                attributes: ADMIN_USER_ATTRIBUTES,
            });
            break;
        case ROLE.USER:
        default:
            users = await User.findAll({
                attributes: PUBLIC_USER_ATTRIBUTES,
            });
    }

    return users;
}

export async function getUserByEmail(email: string) {
    return await User.findOne({
        where: { email },
    });
}

export async function getUser(id: string) {
    const user = await User.findOne({
        where: { id },
        attributes: ADMIN_USER_ATTRIBUTES,
        raw: true,
    });

    const userCompletedExercises = await ComletedExercise.findAll({
        where: { userID: id },
        attributes: ["id", "exercise.name", "exercise.createdAt", "duration"],
        include: [{ model: Exercise, attributes: [] }],
        raw: true,
    });

    return {
        ...user,
        completedExercises: userCompletedExercises,
    };
}

export async function createUser(user: TUser) {
    return await User.create({
        email: user.email,
        password: user.password,
        name: user.name,
        surname: user.surname,
        nickName: user.nickName,
        role: user.role || ROLE.USER,
        age: user.age,
    });
}

export async function updateUser(
    id: number,
    name: string,
    surname: string,
    nickName: string,
    role: ROLE,
    age: number
) {
    const user = await User.findOne({
        where: { id },
        attributes: ADMIN_USER_ATTRIBUTES,
    });
    user.set({
        name: name || user.name,
        surname: surname || user.surname,
        nickName: nickName || user.nickName,
        role: role || user.role,
        age: age || user.age,
    });
    await user.save();

    return user;
}
