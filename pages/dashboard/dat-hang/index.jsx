import React from 'react'
import OrdersAdminPage from '../../../components/users/ListOrders'
import AdminLayout from '../../../components/layout/AdminLayout'

export default function index() {
  return (
    <AdminLayout title="Danh sách khách hàng">
    <div className='p-2 bg-white dark:bg-slate-900  min-h-screen'>
      {/* Rencent Orders Table */}
      <OrdersAdminPage />
    </div>

      </AdminLayout>

  )
}
