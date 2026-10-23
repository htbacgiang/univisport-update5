import React from 'react'
import CustomDataTable from '../../../components/backend/dashboard/CustomDataTable'
import AdminLayout from '../../../components/layout/AdminLayout'

export default function index() {
  return (
    <AdminLayout title="Danh sách khách hàng">
    <div className='p-2 bg-white dark:bg-slate-900 text-slate-50 min-h-screen'>
      {/* Rencent Orders Table */}
      <CustomDataTable />
    </div>

      </AdminLayout>

  )
}
