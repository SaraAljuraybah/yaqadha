import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  Building2, 
  Lock, 
  Users, 
  Clock, 
  Scale, 
  Ban, 
  ShieldAlert, 
  ArrowLeft,
  Filter
} from 'lucide-react';
import { DocumentDossier, ActiveScreen } from '../types';

interface ExecutiveDashboardScreenProps {
  documents: DocumentDossier[];
  onSelectDocument: (doc: DocumentDossier, targetScreen: ActiveScreen) => void;
  onPublishSuccess?: (title: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const ExecutiveDashboardScreen: React.FC<ExecutiveDashboardScreenProps> = ({
  documents,
  onSelectDocument,
  onPublishSuccess,
  searchQuery: externalSearchQuery,
  setSearchQuery: setExternalSearchQuery,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = setExternalSearchQuery || setInternalSearchQuery;
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'review' | 'blocked'>('all');

  const yellowDocs = documents.filter(d => d.riskLevel === 'review');
  const redDocs = documents.filter(d => d.riskLevel === 'blocked');
  const safeDocs = documents.filter(d => d.riskLevel === 'safe');

  const totalCount = documents.length;
  const blockedCount = redDocs.length;
  const reviewCount = yellowDocs.length;
  const safeCount = safeDocs.length;

  const blockedPercent = totalCount > 0 ? Number(((blockedCount / totalCount) * 100).toFixed(1)) : 0;
  const reviewPercent = totalCount > 0 ? Number(((reviewCount / totalCount) * 100).toFixed(1)) : 0;
  const safePercent = totalCount > 0 ? Number((100 - (blockedPercent + reviewPercent)).toFixed(1)) : 0;

  // Filter documents based on search and status
  const filteredDocs = documents.filter(doc => {
    // Status filter
    if (statusFilter === 'safe' && doc.riskLevel !== 'safe') return false;
    if (statusFilter === 'review' && doc.riskLevel !== 'review') return false;
    if (statusFilter === 'blocked' && doc.riskLevel !== 'blocked') return false;

    // Search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const statusLabel = doc.riskLevel === 'blocked' ? 'محظور' : doc.riskLevel === 'review' ? 'قيد المراجعة' : 'معتمد';
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.code.toLowerCase().includes(query) ||
      doc.department.toLowerCase().includes(query) ||
      doc.responsibleDeptHead.toLowerCase().includes(query) ||
      statusLabel.toLowerCase().includes(query) ||
      (doc.riskLevel === 'safe' && 'آمن'.includes(query)) ||
      doc.riskLevel.toLowerCase().includes(query)
    );
  });

  return (
    <div id="executive-dashboard-screen" className="space-y-6 text-right">
      
      {/* 1. Header Title */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          سجل المستندات
        </h1>
        <p className="text-xs sm:text-sm font-normal text-slate-600 mt-1">
          لوحة المتابعة الشاملة للمستندات
        </p>
      </div>

      {/* 2. Compact Compliance Overview & Proportional Distribution Bar (مخطط معدل الامتثال وتوزيع حالات الوثائق) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs space-y-2.5 text-right">
        <div className="text-xs sm:text-sm font-bold text-slate-900">
          معدل الامتثال وتوزيع حالات الوثائق
        </div>

        {/* Proportional Segmented Bar */}
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {blockedCount > 0 && (
            <div 
              style={{ width: `${blockedPercent}%` }} 
              className="bg-red-600 transition-all duration-500 h-full"
              title={`محظور: ${blockedCount} (${blockedPercent}%)`}
            />
          )}
          {reviewCount > 0 && (
            <div 
              style={{ width: `${reviewPercent}%` }} 
              className="bg-amber-500 transition-all duration-500 h-full"
              title={`قيد المراجعة: ${reviewCount} (${reviewPercent}%)`}
            />
          )}
          {safeCount > 0 && (
            <div 
              style={{ width: `${safePercent}%` }} 
              className="bg-emerald-600 transition-all duration-500 h-full"
              title={`معتمد: ${safeCount} (${safePercent}%)`}
            />
          )}
        </div>

        {/* Compact Legend */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-7 text-xs pt-0.5">
          <div className="flex items-center gap-1.5 text-red-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
            <span>محظور ({blockedPercent}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span>قيد المراجعة ({reviewPercent}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
            <span>معتمد ({safePercent}%)</span>
          </div>
        </div>
      </div>

      {/* Comprehensive File List Table */}
      <section id="unified-documents-table" className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Toolbar: Balanced 50/50 Layout (Search on Right, 4 Equal Filters on Left) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          
          {/* 1. جهة اليمين (50% من العرض): حقل البحث المتسع والمريح */}
          <div className="relative w-full h-11">
            <Search className="w-4.5 h-4.5 text-[#2C3E28] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="table-toolbar-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث برقم المستند، العنوان، الإدارة، أو الحالة..."
              className="w-full h-11 pr-11 pl-9 text-xs sm:text-sm font-normal text-slate-800 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E28] focus:border-[#2C3E28] transition-all shadow-2xs placeholder:text-slate-400 box-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
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
              onClick={() => setStatusFilter('all')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center font-bold truncate ${
                statusFilter === 'all'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              الكل ({documents.length})
            </button>
            <button
              onClick={() => setStatusFilter('blocked')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 font-bold truncate ${
                statusFilter === 'blocked'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
              <span>محظور ({redDocs.length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('review')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 font-bold truncate ${
                statusFilter === 'review'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span className="truncate">قيد المراجعة ({yellowDocs.length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('safe')}
              className={`h-full rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 font-bold truncate ${
                statusFilter === 'safe'
                  ? 'bg-[#2C3E28] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>معتمد ({safeDocs.length})</span>
            </button>
          </div>

        </div>

        {/* Table Content with Equal 5-Column Alignment and Uniform Row Height */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-right border-collapse text-xs min-w-[960px]">
            <colgroup>
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-bold text-xs">
                <th className="py-3.5 px-4 text-right w-1/5">رقم المستند</th>
                <th className="py-3.5 px-4 text-right w-1/5">عنوان المستند</th>
                <th className="py-3.5 px-4 text-right w-1/5">الإدارة المسؤولة</th>
                <th className="py-3.5 px-4 text-right w-1/5">حالة المستند</th>
                <th className="py-3.5 px-4 text-right w-1/5">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => {
                const isBlocked = doc.riskLevel === 'blocked';
                const isReview = doc.riskLevel === 'review';
                const isSafe = doc.riskLevel === 'safe';

                // تحليل اسم المسؤول والمنصب من النص
                const match = doc.responsibleDeptHead.match(/^(.*?)\s*\((.*?)\)$/);
                const headName = match ? match[1].trim() : doc.responsibleDeptHead;
                const headRole = match ? match[2].trim() : '';

                return (
                  <tr 
                    key={doc.id}
                    id={`doc-row-${doc.id}`}
                    className={`transition-all h-[104px] ${
                      isBlocked
                        ? 'hover:bg-red-50/30 bg-red-50/15'
                        : isReview
                        ? 'hover:bg-amber-50/30 bg-amber-50/10'
                        : 'hover:bg-emerald-50/20'
                    }`}
                  >
                    
                    {/* رقم المستند فقط دون نصوص فرعية */}
                    <td className="py-3.5 px-4 font-mono w-1/5 text-right align-middle">
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {doc.code}
                      </span>
                    </td>

                    {/* عنوان المستند - مقيد بسطرين كحد أقصى */}
                    <td className="py-3.5 px-4 w-1/5 text-right align-middle">
                      <div className="line-clamp-2 text-xs font-bold text-slate-900 leading-snug">
                        {doc.title}
                      </div>
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5 truncate">
                        تاريخ الإنشاء: {doc.creationDate.split(' ')[0]}
                      </div>
                    </td>

                    {/* 1. الإدارة المسؤولة ورئيس القسم: المسمى الوظيفي رمادي فاتح أصغر حجماً */}
                    <td className="py-3.5 px-4 w-1/5 text-right align-middle">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-xs line-clamp-1">
                          {doc.department}
                        </div>
                        <div className="text-[11px] text-slate-700 font-medium line-clamp-1">
                          المسؤول: <span className="font-bold text-slate-800">{headName}</span>
                        </div>
                        {headRole && (
                          <div className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                            {headRole}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 2. حالة المستند والتشخيص الرقابي - إشارة ثابتة دون نبض */}
                    <td className="py-3.5 px-4 w-1/5 text-right align-middle">
                      <div className="space-y-1.5">
                        {/* الشارة الملونة الثابتة */}
                        <div>
                          {isBlocked && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                              <span>محظور</span>
                            </span>
                          )}
                          {isReview && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                              <span>قيد المراجعة</span>
                            </span>
                          )}
                          {isSafe && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                              <span>معتمد</span>
                            </span>
                          )}
                        </div>

                        {/* نص التشخيص وسبب الإنذار - مقيد بسطرين كحد أقصى */}
                        {isBlocked && (
                          <div className="line-clamp-2 text-[11px] leading-snug font-medium text-slate-700">
                            توقيع منفرد ({headName}) • محال لمعالي رئيس المنظومة
                          </div>
                        )}
                        {isReview && (
                          <div className="line-clamp-2 text-[11px] leading-snug font-medium text-slate-700">
                            اطلع عليه شخصان فقط • 2 من 4 تواقيع • محال لرئيس قسم المالية
                          </div>
                        )}
                        {isSafe && (
                          <div className="line-clamp-2 text-[11px] leading-snug font-medium text-slate-700">
                            اكتملت التواقيع واعتماد الرؤساء • موافقة تلقائية للنشر الرقمي
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 3. الإجراء: زر معاينة المستند بنمط Outlined مريح بصرياً مع Hover بلون الهوية */}
                    <td className="py-3.5 px-4 w-1/5 text-right align-middle">
                      <button
                        id={`btn-view-dossier-${doc.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDocument(doc, 'file_dossier');
                        }}
                        className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs bg-white hover:bg-[#2C3E28] text-[#2C3E28] hover:text-white border border-[#2C3E28]/40 hover:border-[#2C3E28] shadow-2xs hover:shadow-md hover:shadow-[#2C3E28]/15 transition-all duration-200"
                      >
                        <span>معاينة المستند</span>
                        <ArrowLeft className="w-3.5 h-3.5 text-[#2C3E28] group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-200" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </section>

    </div>
  );
};
