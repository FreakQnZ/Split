import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";


// export async function DELETE(req) {
//     const { searchParams } = new URL(req.url);
//     const username = searchParams.get("user");
//     try {
//         const query = `DROP DATABASE splitDB;`;
//         const res = await pool.query(query, [username]);
//         if (!res) {
//             return NextResponse.json({ success: false, error: "Timeout, No response from Vercel" });
//         }
//         return NextResponse.json({ success: true, message: "Database deleted", res });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: error });
//     }
// }

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("user");
    try {
        const query = `

        DROP TABLE IF EXISTS bill_participants;
        DROP TABLE IF EXISTS expenses;
        DROP TABLE IF EXISTS friends;
        DROP TABLE IF EXISTS bills;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            token_version integer DEFAULT 1,
            username varchar NOT NULL UNIQUE,
            email varchar NOT NULL UNIQUE,
            password varchar NOT NULL
        );
        CREATE TABLE bills (
            bill_id SERIAL PRIMARY KEY,
            bill_name varchar(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER REFERENCES users(user_id)

        );
        CREATE TABLE friends (
            user_id INT NOT NULL,
            friend_id INT NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, friend_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
        CREATE TABLE bill_participants (
            id SERIAL PRIMARY KEY,
            bill_no INT REFERENCES bills(bill_no),
            user_id INT REFERENCES users(user_id),
            amount_owed DECIMAL(10, 2),
            settled BOOLEAN DEFAULT FALSE
        );
        CREATE TABLE expenses (
            expense_id SERIAL PRIMARY KEY,
            bill_id INT NOT NULL,
            split_id INT,
            user_id INT NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_bill FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
`;
        const res = await pool.query(query, [username]);
        if (!res) {
            return NextResponse.json({ success: false, error: "Timeout, No response from Vercel" });
        }
        return NextResponse.json({ success: true, message: "Database Created", res });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}
