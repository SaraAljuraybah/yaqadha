import React, { useMemo, useState } from 'react';
import { 
  Lock, 
  Search, 
  CheckCircle2 
} from 'lucide-react';
import { formatNodes, useLanguage } from '../i18n';
import { getUsers } from '../data/demo';

export const AccessManagementScreen: React.FC = () => {
  const { lang, t } = useLanguage();
  const mockUsers = useMemo(() => getUsers(lang), [lang]);
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
      const statusLabel = u.status === 'restricted' ? t('accessManagement.searchStatusRestricted') : t('accessManagement.searchStatusActive');
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
    <div id="access-management-screen" className="space-y-6 text-start">
      
      {/* 1. Header Title & Introduction */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t('accessManagement.title')}
        </h1>
        <p className="text-xs sm:text-sm font-normal text-slate-600 mt-1">
          {t('accessManagement.subtitle')}
        </p>
      </div>

      {/* 2. Comprehensive Users Registry & Permissions Matrix Table */}
      <section id="unified-users-permissions-table" className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Toolbar: Balanced 50/50 Layout (Search on Right, 4 Equal Filters on Left) - Exact Match with Documents Registry */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          
          {/* 1. جهة اليمين (50% من العرض): حقل البحث المتسع والمريح */}
          <div className="relative w-full h-11">
            <Search className="w-4.5 h-4.5 text-[#2C3E28] absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="users-table-toolbar-search-input"
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder={t('accessManagement.searchPlaceholder')}
              className="w-full h-11 ps-11 pe-9 text-xs sm:text-sm font-normal text-slate-800 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E28] focus:border-[#2C3E28] transition-all shadow-2xs placeholder:text-slate-400 box-border"
            />
            {searchUser && (
              <button
                onClick={() => setSearchUser('')}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center transition-all"
                title={t('common.clearSearch')}
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
              {formatNodes(t('accessManagement.filterAll'), { count: mockUsers.length })}
            </button>
            <button
              onClick={() => setFilterRole('signers')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center font-bold truncate ${
                filterRole === 'signers'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {formatNodes(t('accessManagement.filterSigners'), { count: signersCount })}
            </button>
            <button
              onClick={() => setFilterRole('audit')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center font-bold truncate ${
                filterRole === 'audit'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {formatNodes(t('accessManagement.filterAuditors'), { count: auditorsCount })}
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
              <span>{formatNodes(t('accessManagement.filterRestricted'), { count: restrictedCount })}</span>
            </button>
          </div>

        </div>

        {/* Users Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs min-w-[960px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-bold text-xs">
                <th className="py-3.5 px-4 text-start">{t('accessManagement.colAccount')}</th>
                <th className="py-3.5 px-4 text-start">{t('accessManagement.colDepartment')}</th>
                <th className="py-3.5 px-4 text-start">{t('accessManagement.colAccessLevel')}</th>
                <th className="py-3.5 px-4 text-start">{t('accessManagement.colTwoFactor')}</th>
                <th className="py-3.5 px-4 text-start">{t('accessManagement.colStatus')}</th>
                <th className="py-3.5 px-4 text-start">{t('accessManagement.colLastActive')}</th>
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
                          {user.name.split(' ')[1] ? user.name.split(' ')[1].charAt(0) : t('accessManagement.avatarFallback')}
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
                        <span>{t('accessManagement.twoFactorEnabled')}</span>
                      </span>
                    </td>

                    {/* حالة الحساب */}
                    <td className="py-3.5 px-4 align-middle">
                      {isRestricted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          <span>{t('accessManagement.statusRestricted')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{t('accessManagement.statusActive')}</span>
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
                      <p className="text-sm font-medium">{t('accessManagement.emptyState')}</p>
                      <button
                        onClick={() => { setSearchUser(''); setFilterRole('all'); }}
                        className="text-xs text-[#2C3E28] hover:underline font-bold mt-1"
                      >
                        {t('accessManagement.resetFilters')}
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
