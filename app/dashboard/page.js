"use client";

import { useState, useEffect } from "react";
import BillSettle from "../components/ui/bill_settle";
import withAuth from "../utils/withAuth"; // Adjust the path accordingly

function Dashboard() {
    const [bills, setBills] = useState([]);
    const [totalExpense, setTotalExpense] = useState("Loading");
    const [toArrive, setToArrive] = useState("Loading");
    const [toGo, setToGo] = useState("Loading");
    const [loading, setLoading] = useState(true);

    const fetchBills = async () => {
        setLoading(true);
        const res = await fetch(
            `/api/bill/split/pending?user=${localStorage.getItem("username")}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await res.json();
        if (data?.success) {
            setBills(data?.data);
            setLoading(false);
        }
    };

    const fetchDash = async () => {
        const res = await fetch(`/api/dashboard?user=${localStorage.getItem("username")}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
        const data = await res.json();
        if (data?.success) {
            setTotalExpense(data?.totalExpense);
            setToArrive(data?.toArrive);
            setToGo(data?.toGo);
        }
    }

    useEffect(() => {
        fetchBills();
        fetchDash();
    }, []);

    return (
        <div
            className="bg-gray-100 p-4 flex flex-col gap-4 "
            style={{ height: "90vh" }}
        >
            <div className=" bg-white rounded-lg lg:min-h-72 flex flex-col">
                <h2 className="text-lg font-semibold mb-4 p-4">Dashboard</h2>
                <div className="stats stats-vertical lg:stats-horizontal shadow m-10">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Total Expense</div>
                        <div className="stat-value">{totalExpense? totalExpense : 0}</div>
                        {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Funds to Arrive</div>
                        <div className="stat-value">{toArrive ? toArrive : 0}</div>
                        {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Funds to Go</div>
                        <div className="stat-value">{toGo ? toGo : 0}</div>
                        {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
                    </div>
                </div>

            </div>
            <div className=" rounded-lg bg-white p-2 flex-1">
                <h2 className="text-lg font-semibold mb-4 p-4">Unsettled Bills</h2>
                <div className="overflow-y-auto h-80 p-4">
                    {loading ? (
                        <div className="flex h-full justify-center items-center ">
                            <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg shadow-lg text-center max-w-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="mx-auto mb-2 h-8 w-8 text-green-500"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0-0l-4-4m4 4V4"
                                    />
                                </svg>
                                <p className="text-lg font-semibold">Loading...</p>
                            </div>
                        </div>
                    ) : bills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center place-items-center ">
                            {bills.map((bill) => (
                                <BillSettle
                                    key={bill.id}
                                    id={bill.id}
                                    Name={bill.from}
                                    amount={bill.amount}
                                    time={bill.time}
                                    BillName={bill.bill}
                                    fetchData={fetchBills}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full justify-center items-center ">
                            <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg shadow-lg text-center max-w-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="mx-auto mb-2 h-8 w-8 text-green-500"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2l4-4"
                                    />
                                </svg>
                                <p className="text-lg font-semibold">
                                    You don't owe anyone any money.
                                </p>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}

export default withAuth(Dashboard);
