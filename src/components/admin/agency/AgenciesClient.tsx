"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAgencies } from "../../../hooks/slices/user/agencySlice";
import { IUser } from "@/models/user";

type Props={
    agencies:IUser[]
}
export default function AgenciesClient({ agencies }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAgencies(agencies));
  }, [agencies, dispatch]);

  return (
   null
  );
}