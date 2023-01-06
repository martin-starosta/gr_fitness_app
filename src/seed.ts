import { models, sequelize } from "./db/index";
import { EXERCISE_DIFFICULTY, ROLE } from "./utils/enums";
import { hashPassword } from "./utils/password";

const { Exercise, Program, User } = models;

const seedDB = async () => {
    await sequelize.sync({ force: true });

    await Program.bulkCreate(
        [
            {
                name: "Program 1",
            },
            {
                name: "Program 2",
            },
            {
                name: "Program 3",
            },
        ] as any[],
        { returning: true }
    );

    await Exercise.bulkCreate([
        {
            name: "Exercise 1",
            difficulty: EXERCISE_DIFFICULTY.EASY,
            programID: 1,
        },
        {
            name: "Exercise 2",
            difficulty: EXERCISE_DIFFICULTY.EASY,
            programID: 2,
        },
        {
            name: "Exercise 3",
            difficulty: EXERCISE_DIFFICULTY.MEDIUM,
            programID: 1,
        },
        {
            name: "Exercise 4",
            difficulty: EXERCISE_DIFFICULTY.MEDIUM,
            programID: 2,
        },
        {
            name: "Exercise 5",
            difficulty: EXERCISE_DIFFICULTY.HARD,
            programID: 1,
        },
        {
            name: "Exercise 6",
            difficulty: EXERCISE_DIFFICULTY.HARD,
            programID: 2,
        },
    ]);

    await User.bulkCreate(
        [
            {
                name: "John",
                surname: "Doe",
                nickName: "john_doe",
                email: "john@user.com",
                password: await hashPassword("user"),
                age: 20,
                role: ROLE.USER,
            },
            {
                name: "Jane",
                surname: "Smith",
                nickName: "jane_smith",
                email: "jane@user.com",
                password: await hashPassword("admin"),
                age: 40,
                role: ROLE.ADMIN,
            },
        ] as any[],
        { returning: true }
    );
};

seedDB()
    .then(() => {
        console.log("DB seed done");
        process.exit(0);
    })
    .catch((err) => {
        console.error("error in seed, check your data and model \n \n", err);
        process.exit(1);
    });
