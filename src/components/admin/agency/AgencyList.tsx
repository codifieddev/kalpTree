"use client";
import { RootState } from '@/store/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IUser } from '@/models/user';
import { DataTableExt } from '@/components/admin/DataTableExt';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AgencyList = () => {

const {user} = useSelector((state:RootState)=>state.user)
  const { agencies, isAgencyLoading } = useSelector((state: RootState) => state.agency);
   const router= useRouter()
  const columns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created', render: (value: any) => value ? new Date(value).toLocaleString() : '-' },
  ];

  // Memoize data for table
  const data = useMemo(() => agencies || [], [agencies]);


  const handleAdd=()=>{
     if(user?.role==="superadmin"){
          router.push("/admin/agencies/createnew")
     }else{
        toast.info("Your are unable to add agency")
     }
   
  }
  return (
    <div>
      <DataTableExt
        title="Agencies"
        data={data}
         onCreate={handleAdd}
        initialColumns={columns}
          opentab={() => {}}
        // loading={isAgencyLoading}
        // Add onView, onDelete, onCreate handlers as needed
      />
    </div>
  );
};

export default AgencyList;
