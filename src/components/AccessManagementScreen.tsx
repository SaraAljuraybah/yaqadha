import React, { useState } from 'react';
import { 
  Lock, 
  Search, 
  CheckCircle2 
} from 'lucide-react';

interface UserRole {
  id: string;
  name: string;
  role: string;
  department: string;
  accessLevel: 'full_audit' | 'executive_signature' | 'financial_approval' | 'legal_compliance' | 'internal_audit' | 'technical_spec';
  accessLevelLabel: string;
  twoFactor: boolean;
  status: 'active' | 'restricted' | 'pending';
  lastActive: string;
  note?: string;
}

const mockUsers: UserRole[] = [
  {
    id: 'u-1',
    name: 'د. فهد الهذلي',
    role: 'مراقب عام تنفيذي',
    department: 'أمانة الرقابة والحوكمة',
    accessLevel: 'full_audit',
    accessLevelLabel: 'رقابة كاملة وتجميد وثائق',
    twoFactor: true,
    status: 'active',
    lastActive: 'الآن (متصل)',
  },
  {
    id: 'u-2',
    name: 'أ. أحمد الخالد',
    role: 'مدير إدارة تقنية المعلومات (المُعد)',
    department: 'إدارة تقنية المعلومات',
    accessLevel: 'technical_spec',
    accessLevelLabel: 'إعداد كراسات ومشاريع',
    twoFactor: true,
    status: 'restricted',
    lastActive: '2026-09-15 08:32',
    note: 'موقوف مؤقتاً',
  },
  {
    id: 'u-3',
    name: 'د. طارق المنصور',
    role: 'رئيس قسم المالية والميزانية',
    department: 'الشؤون المالية',
    accessLevel: 'financial_approval',
    accessLevelLabel: 'اعتماد الميزانيات والصرف والتحقيق',
    twoFactor: true,
    status: 'active',
    lastActive: 'منذ ساعة',
  },
  {
    id: 'u-4',
    name: 'أ. نورة الشمري',
    role: 'المستشار القانوني العام',
    department: 'الإدارة القانونية',
    accessLevel: 'legal_compliance',
    accessLevelLabel: 'مطابقة نظامية وفحص عقود',
    twoFactor: true,
    status: 'active',
    lastActive: 'منذ 3 ساعات',
  },
  {
    id: 'u-5',
    name: 'د. عبد الله الغامدي',
    role: 'نائب الرئيس التنفيذي للتشغيل',
    department: 'الإدارة العليا',
    accessLevel: 'executive_signature',
    accessLevelLabel: 'اعتماد نهائي وإذن نشر',
    twoFactor: true,
    status: 'active',
    lastActive: 'منذ ساعتين',
  },
  {
    id: 'u-6',
    name: 'أ. خالد السليمان',
    role: 'مدير عام تقنية المعلومات',
    department: 'إدارة تقنية المعلومات',
    accessLevel: 'executive_signature',
    accessLevelLabel: 'إشراف وتأييد الاحتياج التقني',
    twoFactor: true,
    status: 'active',
    lastActive: 'اليوم، 11:20 ص',
  },
  {
    id: 'u-7',
    name: 'سعد عبد الرحمن الخالدي',
    role: 'أخصائي مطابقة فواتير',
    department: 'الشؤون المالية',
    accessLevel: 'financial_approval',
    accessLevelLabel: 'إعداد ومطابقة تسويات مالية',
    twoFactor: true,
    status: 'active',
    lastActive: 'أمس 01:10 م',
  },
  {
    id: 'u-8',
    name: 'أمل مساعد المطيري',
    role: 'محاسب مدفوعات',
    department: 'الشؤون المالية',
    accessLevel: 'financial_approval',
    accessLevelLabel: 'صرف وتسويات بنكية',
    twoFactor: true,
    status: 'active',
    lastActive: 'أمس 02:35 م',
  },
  {
    id: 'u-9',
    name: 'أ. عادل الرشيدي',
    role: 'مدير إدارة الشؤون الإدارية والأرشفة',
    department: 'الشؤون الإدارية',
    accessLevel: 'executive_signature',
    accessLevelLabel: 'إدارة السجلات ولجان الإتلاف',
    twoFactor: true,
    status: 'active',
    lastActive: 'منذ يومين',
  },
  {
    id: 'u-10',
    name: 'أ. نورة الدوسري',
    role: 'أخصائي تدقيق داخلي',
    department: 'المراجعة والامتثال',
    accessLevel: 'internal_audit',
    accessLevelLabel: 'تدقيق الأثر الرقمي والمطابقة',
    twoFactor: true,
    status: 'active',
    lastActive: 'اليوم، 10:45 ص',
  },
];

export const AccessManagementScreen: React.FC = () => {
  const [filterRole, setFilterRole] = useState<'all' | 'audit' | 'signers' | 'restricted'>('all');
  const [searchUser, setSearchUser] = useState('');

  const restrictedCount = mockUsers.filter(u => u.status === 'restricted').length;
  const signersCount = mockUsers.filter(u => u.accessLevel === 'executive_signature' || u.accessLevel === 'financial_approval').length;
  const auditorsCount = mockUsers.filter(u => u.accessLevel === 'full_audit' || u.accessLevel === 'internal_audit' || u.accessLevel === 'legal_compliance').length;

  const filteredUsers = mockUsers.filter(u => {
    if (filterRole === 'audit' && u.accessLevel !== 'full_audit' && u.accessLevel !== 'internal_audit' && u.accessLevel !== 'legal_compliance') return false;
    if (filterRole === 'signers' && u.accessLevel !== 'executive_signature' && u.accessLevel !== 'financial_approval') return false;
    if (filterRole === 'restricted' && u.status !== 'restricted') return false;
    if (searchUser) {
      const q = searchUser.toLowerCase();
      const statusLabel = u.status === 'restricted' ? 'موقوف مقيد' : 'نشط مصرح';
      return (
        u.name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.accessLevelLabel.toLowerCase().includes(q) ||
        statusLabel.toLowerCase().includes(q) ||
        (u.note && u.note.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div id="access-management-screen" className="space-y-6 text-right">
      
      {/* 1. Header Title & Introduction */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          إدارة الحسابات والصلاحيات
        </h1>
        <p className="text-xs sm:text-sm font-normal text-slate-600 mt-1">
          لوحة المتابعة الشاملة للحسابات والصلاحيات
        </p>
      </div>

      {/* 2. Comprehensive Users Registry & Permissions Matrix Table */}
      <section id="unified-users-permissions-table" className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Toolbar: Balanced 50/50 Layout (Search on Right, 4 Equal Filters on Left) - Exact Match with Documents Registry */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          
          {/* 1. جهة اليمين (50% من العرض): حقل البحث المتسع والمريح */}
          <div className="relative w-full h-11">
            <Search className="w-4.5 h-4.5 text-[#2C3E28] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="users-table-toolbar-search-input"
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="بحث بالاسم، المنصب، الإدارة، أو مستوى الصلاحية..."
              className="w-full h-11 pr-11 pl-9 text-xs sm:text-sm font-normal text-slate-800 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E28] focus:border-[#2C3E28] transition-all shadow-2xs placeholder:text-slate-400 box-border"
            />
            {searchUser && (
              <button
                onClick={() => setSearchUser('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center transition-all"
                title="مسح البحث"
              >
                ✕
              </button>
            )}
          </div>

          {/* 2. جهة اليسار (50% من العرض): أزرار التصفية والفلترة موزعة بالتساوي وبنفس الارتفاع */}
          <div className="w-full h-11 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-4 gap-1.5 box-border">
            <button
              onClick={() => setFilterRole('all')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center font-bold truncate ${
                filterRole === 'all'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              الكل ({mockUsers.length})
            </button>
            <button
              onClick={() => setFilterRole('signers')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center font-bold truncate ${
                filterRole === 'signers'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              المفوضون ({signersCount})
            </button>
            <button
              onClick={() => setFilterRole('audit')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center font-bold truncate ${
                filterRole === 'audit'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              المراقبون ({auditorsCount})
            </button>
            <button
              onClick={() => setFilterRole('restricted')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 font-bold truncate ${
                filterRole === 'restricted'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
              <span>المقيدة ({restrictedCount})</span>
            </button>
          </div>

        </div>

        {/* Users Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs min-w-[960px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-bold text-xs">
                <th className="py-3.5 px-4 text-right">المسؤول / الحساب</th>
                <th className="py-3.5 px-4 text-right">الإدارة والقسم</th>
                <th className="py-3.5 px-4 text-right">مستوى الصلاحية المعتمد</th>
                <th className="py-3.5 px-4 text-right">المصادقة الثنائية</th>
                <th className="py-3.5 px-4 text-right">حالة الحساب</th>
                <th className="py-3.5 px-4 text-right">آخر نشاط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isRestricted = user.status === 'restricted';

                return (
                  <tr 
                    key={user.id} 
                    className={`transition-colors ${
                      isRestricted 
                        ? 'bg-red-50/15 hover:bg-red-50/30' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    
                    {/* المسؤول والحساب */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${
                          isRestricted 
                            ? 'bg-red-100 text-red-800 border-red-200 ring-2 ring-red-300' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {user.name.split(' ')[1] ? user.name.split(' ')[1].charAt(0) : 'م'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5">{user.role}</div>
                          {user.note && (
                            <div className="text-[10px] text-red-700 font-normal mt-0.5 max-w-xs">
                              {user.note}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* الإدارة */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="font-medium text-slate-700 text-xs">{user.department}</div>
                    </td>

                    {/* مستوى الصلاحية */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold text-[11px] border ${
                        isRestricted
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-emerald-50 text-[#2C3E28] border-emerald-200'
                      }`}>
                        <Lock className="w-3 h-3" />
                        <span>{user.accessLevelLabel}</span>
                      </span>
                    </td>

                    {/* المصادقة الثنائية */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-normal text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>مفعلة (Hardware Token)</span>
                      </span>
                    </td>

                    {/* حالة الحساب */}
                    <td className="py-3.5 px-4 align-middle">
                      {isRestricted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          <span>موقوف مؤقتاً (رصد توقيع منفرد)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>نشط ومصرح</span>
                        </span>
                      )}
                    </td>

                    {/* آخر نشاط */}
                    <td className="py-3.5 px-4 align-middle text-slate-600 text-xs font-mono">
                      {user.lastActive}
                    </td>

                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-medium">لا توجد حسابات مطابقة لبحثك</p>
                      <button
                        onClick={() => { setSearchUser(''); setFilterRole('all'); }}
                        className="text-xs text-[#2C3E28] hover:underline font-bold mt-1"
                      >
                        إعادة ضبط البحث والتصفية
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>

    </div>
  );
};
