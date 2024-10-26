import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("user");
    let totalExpense = 0
    let toArrive = 0
    let toGo = 0
    try {
      const query1 = `SELECT user_id FROM users WHERE username = $1`;
      const currentUserQuery = await pool.query(query1, [username]);
      if (currentUserQuery.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: "Current user not found.",
        });
      }

      const query2 = `
          SELECT SUM(e.amount) AS total_amount
          FROM expenses e
          JOIN bills b ON e.bill_id = b.bill_id
          WHERE e.user_id = $1
    `;
      const res = await pool.query(query2, [currentUserQuery.rows[0].user_id]);
      if (!res) {
        return NextResponse.json({ success: false, error: "Bill not found." });
      }
      totalExpense = res.rows[0].total_amount
    //   const data = res.rows.map((row) => ({
    //     id: row.expense_id,
    //     bill_name: row.bill_name,
    //     amount: row.amount,
    //     created_at: row.created_at,
    //   }));
    //   console.log(data);
      const query3 = `
            SELECT SUM(bp.amount_owed) as sum
            FROM bills b
            JOIN bill_participants bp ON b.bill_id = bp.bill_id
            JOIN users u ON u.user_id = bp.user_id
            WHERE b.user_id = $1 AND bp.amount_owed > 0 AND bp.settled = false
      `
      const res2 = await pool.query(query3, [currentUserQuery.rows[0].user_id])
      if (!res2) {
        return NextResponse.json({ success: false, error: "Bill not found." });
      }
      toArrive = res2.rows[0].sum

      const query4 = `
            SELECT SUM(bp.amount_owed) AS owed
            FROM bill_participants bp
            JOIN bills b ON bp.bill_id = b.bill_id
            JOIN users u ON b.user_id = u.user_id
            WHERE bp.user_id = $1 AND bp.settled = false
      `
      const res3 = await pool.query(query4, [currentUserQuery.rows[0].user_id])
      if (!res3) {
        return NextResponse.json({ success: false, error: "Bill not found." });
      }
      toGo = res3.rows[0].owed
      return NextResponse.json({ success: true, totalExpense, toArrive, toGo });
    } catch (error) {
      return NextResponse.json({ success: false, error: error });
    }
  }
