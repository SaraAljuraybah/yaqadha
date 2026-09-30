import { DocumentDossier } from '../types';
import { Lang, Localizable, localize } from '../i18n/localize';

// Demo data source: every user-facing text field is given as { ar, en }.
// IDs, codes, hashes, IPs and numbers are language-neutral and stay plain.
export const initialDocuments: Localizable<DocumentDossier>[] = [
  // 1. Red Alert Document (#DOC-2026-01) - محظور (توقيع منفرد)
  {
    id: 'doc-1',
    code: '#DOC-2026-01',
    title: { ar: 'كراسة الشروط والمواصفات لمشروع التوسع التقني', en: 'Terms & Specifications Booklet for the Technical Expansion Project' },
    category: { ar: 'مناقصات ومشاريع تقنية', en: 'Technical Tenders & Projects' },
    department: { ar: 'إدارة تقنية المعلومات', en: 'Information Technology Department' },
    responsibleDeptHead: { ar: 'أ. أحمد الخالد (مدير إدارة تقنية المعلومات)', en: 'Mr. Ahmed Al-Khaled (Director of Information Technology)' },
    budget: { ar: '14,500,000 ر.س', en: 'SAR 14,500,000' },
    creationDate: '2026-09-15 08:30:00',
    lastModified: '2026-09-15 08:32:19',
    status: 'blocked',
    riskLevel: 'blocked',
    riskScore: 94,
    tags: [
      { ar: '🔴 توقيع منفرد', en: '🔴 Single signature' },
      { ar: 'تسريع غير منطقي', en: 'Irregular acceleration' },
      { ar: 'محال لمعالي رئيس المنظومة', en: 'Referred to the CEO' },
    ],

    // نظام الحوكمة وتتبع مسار التواقيع
    governance: {
      passCount: 2, // مر مرتين فقط
      viewersCount: 1, // شخص واحد فقط اطلع عليه
      signaturesCount: 1, // توقيع منفرد
      requiredSignaturesCount: 4, // المطلوب 4 تواقيع
      hasSeniorExecutiveSignature: false,
      isSequenceCompliant: false,
      speedAnomaly: true,

      platformApprovalStatus: 'escalated_to_ceo_permanently_blocked',
      approvalDecisionText: {
        ar: '🔴 تم حظر النشر منعاً باتاً وتصعيد الملف فوراً لمعالي رئيس المنظومة بسبب رصد توقيع منفرد وتخطي مسار الحوكمة',
        en: '🔴 Publishing strictly prohibited and the file immediately escalated to the CEO after a single signature and a bypassed governance path were detected',
      },
      assignedAuthority: { ar: 'معالي رئيس المنظومة ورئيس مجلس الإدارة', en: 'The CEO and Chairman of the Board' },
      actionDetails: [
        {
          ar: 'رصد توقيع منفرد: اعتماد ونشر فوري بواسطة شخص واحد (أ. أحمد الخالد) دون استكمال التواقيع الإلزامية.',
          en: 'Single signature detected: immediate approval and publishing by one person (Mr. Ahmed Al-Khaled) without completing the mandatory signatures.',
        },
        {
          ar: 'غياب التواقيع الإلزامية لرؤساء الإدارات (المالية والقانونية والقيادية).',
          en: 'Mandatory signatures from department heads (Finance, Legal, and Executive) are missing.',
        },
        {
          ar: 'تم تجميد المستند نهائياً ورفع التقرير الاستباقي لمكتب رئيس المنظومة.',
          en: 'The document has been permanently frozen and the proactive report submitted to the CEO’s office.',
        },
        {
          ar: 'يُمنع منعاً باتاً نشر هذا المستند أو توثيقه مستقبلاً بموجب قرار المنصة التلقائي.',
          en: 'Publishing or certifying this document in the future is strictly prohibited by the platform’s automatic decision.',
        },
      ],
    },

    // سجل من اطلع عليه
    viewers: [
      {
        id: 'v-1',
        name: { ar: 'أ. أحمد الخالد', en: 'Mr. Ahmed Al-Khaled' },
        role: { ar: 'مدير إدارة تقنية المعلومات (المُعد)', en: 'Director of Information Technology (Preparer)' },
        department: { ar: 'إدارة تقنية المعلومات', en: 'Information Technology Department' },
        viewedAt: '2026-09-15 08:30:00',
        timeSpent: { ar: 'دقيقتان و 19 ثانية (تسريع مريب)', en: '2 minutes 19 seconds (suspicious acceleration)' },
        ip: { ar: '192.168.10.45 (عبر VPN)', en: '192.168.10.45 (via VPN)' },
      },
    ],

    // مصفوفة وترتيب التواقيع
    signatureSteps: [
      {
        step: 1,
        roleTitle: { ar: 'المُعد ومسؤول الكراسة', en: 'Preparer & Booklet Owner' },
        officerName: { ar: 'أ. أحمد الخالد', en: 'Mr. Ahmed Al-Khaled' },
        department: { ar: 'إدارة تقنية المعلومات', en: 'Information Technology Department' },
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: '2026-09-15 08:32:19',
        orderCompliant: true,
        notes: { ar: 'توقيع منفرد أحادي تم رصده وتجميده', en: 'Unilateral single signature detected and frozen' },
      },
      {
        step: 2,
        roleTitle: { ar: 'رئيس قسم الميزانية والتدقيق المالي', en: 'Head of Budget & Financial Audit' },
        officerName: { ar: 'د. طارق المنصور', en: 'Dr. Tariq Al-Mansour' },
        department: { ar: 'الشؤون المالية', en: 'Financial Affairs' },
        isSeniorExecutive: true,
        status: 'bypassed',
        orderCompliant: false,
        notes: { ar: '⚠️ تم تخطي التوقيع عمداً وتمرير الملف للنشر', en: '⚠️ Signature deliberately bypassed and the file pushed to publishing' },
      },
      {
        step: 3,
        roleTitle: { ar: 'المستشار القانوني العام', en: 'General Legal Counsel' },
        officerName: { ar: 'أ. نورة الشمري', en: 'Ms. Noura Al-Shammari' },
        department: { ar: 'الإدارة القانونية', en: 'Legal Department' },
        isSeniorExecutive: true,
        status: 'bypassed',
        orderCompliant: false,
        notes: { ar: '⚠️ تم تخطي المراجعة النظامية', en: '⚠️ Regulatory review bypassed' },
      },
      {
        step: 4,
        roleTitle: { ar: 'نائب الرئيس التنفيذي للمشاريع', en: 'Deputy CEO for Projects' },
        officerName: { ar: 'د. عبد الله الغامدي', en: 'Dr. Abdullah Al-Ghamdi' },
        department: { ar: 'الإدارة العليا', en: 'Executive Management' },
        isSeniorExecutive: true,
        status: 'bypassed',
        orderCompliant: false,
        notes: { ar: '⚠️ تم تخطي الاعتماد القيادي الأعلى', en: '⚠️ Top executive approval bypassed' },
      },
    ],

    metrics: {
      views: 3,
      downloads: 1,
      edits: 2,
      exportAttempts: 1,
    },

    auditLogs: [
      {
        id: 'log-1',
        user: { ar: 'أ. أحمد الخالد', en: 'Mr. Ahmed Al-Khaled' },
        role: { ar: 'مدير إدارة تقنية المعلومات (المُعد)', en: 'Director of Information Technology (Preparer)' },
        action: {
          ar: 'طلب نشر واعتماد فوري لكراسة الشروط بتوقيع منفرد وتخطي التواقيع الرقابية',
          en: 'Requested immediate publishing and approval of the booklet with a single signature, bypassing oversight signatures',
        },
        timestamp: '2026-09-15 08:32:19',
        ip: '192.168.10.45',
        device: { ar: 'محطة العمل 02 عبر VPN', en: 'Workstation 02 via VPN' },
        isFlagged: true,
        flagReason: { ar: 'توقيع منفرد وتخطي 3 مستويات رقابية إلزامية', en: 'Single signature bypassing 3 mandatory oversight levels' },
        hashVerified: false,
      },
    ],

    signatures: [
      {
        id: 'sig-1',
        name: { ar: 'أ. أحمد الخالد', en: 'Mr. Ahmed Al-Khaled' },
        title: { ar: 'مدير إدارة تقنية المعلومات (المُعد)', en: 'Director of Information Technology (Preparer)' },
        avatar: 'AK',
        department: { ar: 'إدارة تقنية المعلومات', en: 'Information Technology Department' },
        status: 'approved',
        timestamp: '2026-09-15 08:32',
      },
      {
        id: 'sig-2',
        name: { ar: 'د. طارق المنصور', en: 'Dr. Tariq Al-Mansour' },
        title: { ar: 'رئيس قسم المالية والميزانية', en: 'Head of Finance & Budget' },
        avatar: 'TM',
        department: { ar: 'المالية', en: 'Finance' },
        status: 'blocked',
        timestamp: { ar: 'تم التخطي غير المصرح به', en: 'Unauthorized bypass' },
      },
      {
        id: 'sig-3',
        name: { ar: 'أ. نورة الشمري', en: 'Ms. Noura Al-Shammari' },
        title: { ar: 'المستشار القانوني العام', en: 'General Legal Counsel' },
        avatar: 'NS',
        department: { ar: 'القانونية', en: 'Legal' },
        status: 'blocked',
        timestamp: { ar: 'تم التخطي غير المصرح به', en: 'Unauthorized bypass' },
      },
      {
        id: 'sig-4',
        name: { ar: 'د. عبد الله الغامدي', en: 'Dr. Abdullah Al-Ghamdi' },
        title: { ar: 'نائب الرئيس التنفيذي', en: 'Deputy CEO' },
        avatar: 'AG',
        department: { ar: 'الإدارة العليا', en: 'Executive Management' },
        status: 'blocked',
        timestamp: { ar: 'تم التخطي غير المصرح به', en: 'Unauthorized bypass' },
      },
    ],

    evidences: [
      {
        id: 'ev-1',
        timestamp: { ar: '08:32:19 ص', en: '08:32:19 AM' },
        user: { ar: 'أ. أحمد الخالد (المُعد)', en: 'Mr. Ahmed Al-Khaled (Preparer)' },
        actionTitle: { ar: 'رصد توقيع منفرد وتخطي سلسلة التواقيع القيادية', en: 'Single signature detected and executive signature chain bypassed' },
        description: {
          ar: 'اطلع شخص واحد فقط على الكراسة (#DOC-2026-01) وطُلب نشرها بتوقيع منفرد متجاوزاً مستويات التدقيق الإلزامية.',
          en: 'Only one person viewed the booklet (#DOC-2026-01), and its publication was requested with a single signature, bypassing the mandatory audit levels.',
        },
        anomalyType: 'bypassed_signatures',
        riskScore: 98,
        ipAddress: '192.168.10.45',
        location: { ar: 'الرياض (شبكة VPN)', en: 'Riyadh (VPN network)' },
        hashBefore: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        hashAfter: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      },
    ],

    aiAnalysis: {
      summary: {
        ar: 'رصد نظام يقظة تسريعاً غير مبرر ومحاولة نشر كراسة الشروط والمواصفات لمشروع التوسع التقني (#DOC-2026-01) بتوقيع منفرد من المُعد أ. أحمد الخالد، مع تخطي 3 مستويات تدقيق رئيسية.',
        en: 'Yaqadha detected unjustified acceleration and an attempt to publish the Terms & Specifications Booklet for the Technical Expansion Project (#DOC-2026-01) with a single signature from the preparer, Mr. Ahmed Al-Khaled, bypassing 3 key audit levels.',
      },
      detectedConflicts: [
        {
          ar: 'تسريع شاذ وتخطي التواقيع الإلزامية: طلب نشر الكراسة بتوقيع منفرد لشخص واحد في دقيقتين.',
          en: 'Abnormal acceleration and bypassed mandatory signatures: the booklet was submitted for publishing with one person’s single signature within two minutes.',
        },
        { ar: 'غياب الاعتماد المالي والتدقيق القانوني المستقل.', en: 'No financial approval or independent legal review.' },
        { ar: 'تعديل وإرسال خارج الأطر الإجرائية النظامية.', en: 'Modified and submitted outside the regulatory procedural framework.' },
      ],
      legalArticles: [
        { ar: 'المادة (16) من نظام مكافحة الفساد وتعارض المصالح الحكومي والشركات.', en: 'Article (16) of the Anti-Corruption and Conflict of Interest Law for government entities and companies.' },
        { ar: 'المادة (43) من لائحة المنافسات والمشتريات: اشتراط سلامة التدرج الرقابي والتواقيع المتسلسلة.', en: 'Article (43) of the Tenders & Procurement Regulation: requires a sound oversight hierarchy and sequential signatures.' },
        { ar: 'المادة (24) من لائحة الانضباط الوظيفي وقواعد تدقيق النزاهة المؤسسية.', en: 'Article (24) of the Workplace Discipline Regulation and Institutional Integrity Audit Rules.' },
      ],
      recommendedAction: {
        ar: 'تأكيد الحظر الأبدي للنشر، والإحالة الجنائية الفورية إلى معالي رئيس المنظومة وهيئة الرقابة ومكافحة الفساد مع تجميد الصلاحيات.',
        en: 'Confirm the permanent publishing block and make an immediate criminal referral to the CEO and the Oversight & Anti-Corruption Authority, with permissions frozen.',
      },
    },
    // Blocked: single unauthorized signature, preparer approved his own booklet alone
    riskInput: {
      record_id: 'DOC-2026-01',
      tender_value_amount: 14500000,
      tender_value_currency: 'SAR',
      lot_count: 1,
      bid_count: 1,
      tenderer_count: 1,
      award_count: 1,
      supplier_count: 1,
      document_count: 3,
      findings: [
        {
          rule_id: 'DOC_001',
          status: 'confirmed',
          manifestation: 'Terms and specifications booklet approved and submitted for publishing with a single unauthorized signature; the mandatory Finance, Legal, and Executive signatures were bypassed.',
          evidence_references: ['log-1', 'ev-1'],
        },
        {
          rule_id: 'COI_001',
          status: 'observed',
          manifestation: 'The preparer approved and requested immediate publication of his own booklet within about two minutes, without independent review.',
          evidence_references: ['log-1', 'v-1'],
        },
      ],
    },
  },

  // 2. Amber Alert Document (#YQ-8841) - اشتباه (خلل إجرائي: مر على شخصين فقط وطُلب نشره فوراً)
  {
    id: 'doc-2',
    code: '#YQ-8841',
    title: { ar: 'عقد توريد أجهزة ومعدات شبكات', en: 'Network Equipment Supply Contract' },
    category: { ar: 'تسويات مالية ومستحقات', en: 'Financial Settlements & Dues' },
    department: { ar: 'قسم المالية والميزانية', en: 'Finance & Budget Section' },
    responsibleDeptHead: { ar: 'د. طارق المنصور (رئيس قسم المالية والميزانية)', en: 'Dr. Tariq Al-Mansour (Head of Finance & Budget)' },
    budget: { ar: '1,240,000 ر.س', en: 'SAR 1,240,000' },
    creationDate: '2026-09-19 11:15:00',
    lastModified: { ar: 'أمس 02:40 م', en: 'Yesterday 02:40 PM' },
    status: 'under_review',
    riskLevel: 'review',
    riskScore: 58,
    tags: [
      { ar: '🟡 إنذار أصفر: خلل إجرائي', en: '🟡 Yellow alert: procedural flaw' },
      { ar: 'اطلع عليه شخصان فقط', en: 'Viewed by only two people' },
      { ar: 'طلب نشر فوري مستعجل', en: 'Urgent immediate publishing request' },
      { ar: 'محال لرئيس قسم المالية', en: 'Referred to the Head of Finance' },
    ],

    // نظام الحوكمة وتتبع مسار التواقيع
    governance: {
      passCount: 3, // مر 3 مرات فقط
      viewersCount: 2, // اطلع عليه شخصان فقط وطُلب نشره فوراً!
      signaturesCount: 2, // وقع عليه شخصان فقط
      requiredSignaturesCount: 4, // المطلوب 4 تواقيع
      hasSeniorExecutiveSignature: false, // لم يوقع رئيس كبير بعد
      isSequenceCompliant: false, // تسلسل ناقص
      speedAnomaly: true, // طلب نشر فوري دون استكمال التدقيق

      platformApprovalStatus: 'routed_to_dept_head',
      approvalDecisionText: {
        ar: '🟡 تم تسجيل الواقعة وإعادة توجيه المستند تلقائياً إلى رئيس قسم المالية والميزانية للتحقيق والاستيضاح',
        en: '🟡 Incident recorded and the document automatically routed to the Head of Finance & Budget for investigation and clarification',
      },
      assignedAuthority: { ar: 'د. طارق المنصور (رئيس قسم المالية والميزانية)', en: 'Dr. Tariq Al-Mansour (Head of Finance & Budget)' },
      actionDetails: [
        {
          ar: 'تسجيل كافة تفاصيل المسار: من اطلع (سعد الخالدي، أمل المطيري) ومن وقع.',
          en: 'All path details recorded: who viewed it (Saad Al-Khalidi, Amal Al-Mutairi) and who signed.',
        },
        {
          ar: 'إعادة توجيه المستند تلقائياً لبريد ولوحة تحكم رئيس قسم المالية والميزانية مع كشف كامل بالأسماء.',
          en: 'Document automatically routed to the Head of Finance & Budget’s inbox and dashboard with a full list of names.',
        },
        {
          ar: 'توجيه رئيس القسم لعقد اجتماع تحقيق مع المعنيين لبحث أسباب محاولة الاستعجال غير المبرر.',
          en: 'The department head is directed to hold an investigation meeting with those involved to examine the reasons for the unjustified rush.',
        },
        {
          ar: 'المستند يمكن أن يُنشر لاحقاً فقط بعد معالجة الخلل، اكتمال التواقيع، واعتماد رئيس القسم.',
          en: 'The document can be published later only after the flaw is resolved, the signatures are complete, and the department head approves.',
        },
      ],
    },

    // سجل من اطلع عليه
    viewers: [
      {
        id: 'v-201',
        name: { ar: 'سعد عبد الرحمن الخالدي', en: 'Saad Abdulrahman Al-Khalidi' },
        role: { ar: 'أخصائي مطابقة فواتير', en: 'Invoice Reconciliation Specialist' },
        department: { ar: 'قسم المالية والميزانية', en: 'Finance & Budget Section' },
        viewedAt: { ar: '2026-09-21 01:10 م', en: '2026-09-21 01:10 PM' },
        timeSpent: { ar: '12 دقيقة', en: '12 minutes' },
        ip: { ar: '10.20.1.15 (الشبكة الداخلية)', en: '10.20.1.15 (internal network)' },
      },
      {
        id: 'v-202',
        name: { ar: 'أمل مساعد المطيري', en: 'Amal Musaed Al-Mutairi' },
        role: { ar: 'محاسب مدفوعات', en: 'Payments Accountant' },
        department: { ar: 'قسم المالية والميزانية', en: 'Finance & Budget Section' },
        viewedAt: { ar: '2026-09-21 02:25 م', en: '2026-09-21 02:25 PM' },
        timeSpent: { ar: '8 دقائق', en: '8 minutes' },
        ip: { ar: '10.20.1.22 (الشبكة الداخلية)', en: '10.20.1.22 (internal network)' },
      },
    ],

    signatureSteps: [
      {
        step: 1,
        roleTitle: { ar: 'أخصائي مطابقة الفواتير', en: 'Invoice Reconciliation Specialist' },
        officerName: { ar: 'سعد عبد الرحمن الخالدي', en: 'Saad Abdulrahman Al-Khalidi' },
        department: { ar: 'الشؤون المالية', en: 'Financial Affairs' },
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: { ar: '2026-09-21 01:25 م', en: '2026-09-21 01:25 PM' },
        orderCompliant: true,
        notes: { ar: 'إعداد أولي', en: 'Initial preparation' },
      },
      {
        step: 2,
        roleTitle: { ar: 'محاسب المدفوعات', en: 'Payments Accountant' },
        officerName: { ar: 'أمل مساعد المطيري', en: 'Amal Musaed Al-Mutairi' },
        department: { ar: 'الشؤون المالية', en: 'Financial Affairs' },
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: { ar: '2026-09-21 02:35 م', en: '2026-09-21 02:35 PM' },
        orderCompliant: true,
        notes: { ar: 'توقيع تالي مع طلب نشر وتوثيق فوري', en: 'Follow-up signature with an immediate publishing and certification request' },
      },
      {
        step: 3,
        roleTitle: { ar: 'رئيس قسم المراجعة والتدقيق الداخلي', en: 'Head of Review & Internal Audit' },
        officerName: { ar: 'أ. منصور القرني', en: 'Mr. Mansour Al-Qarni' },
        department: { ar: 'المراجعة الداخلية', en: 'Internal Audit' },
        isSeniorExecutive: false,
        status: 'pending',
        orderCompliant: false,
        notes: { ar: '⏳ مطلوب توقيعه قبل أي اعتماد', en: '⏳ Signature required before any approval' },
      },
      {
        step: 4,
        roleTitle: { ar: 'رئيس قسم المالية والميزانية', en: 'Head of Finance & Budget' },
        officerName: { ar: 'د. طارق المنصور', en: 'Dr. Tariq Al-Mansour' },
        department: { ar: 'قسم المالية والميزانية', en: 'Finance & Budget Section' },
        isSeniorExecutive: true,
        status: 'pending',
        orderCompliant: false,
        notes: { ar: '⏳ محال لمكتبه للتحقيق واعتماد النشر', en: '⏳ Referred to his office for investigation and publishing approval' },
      },
    ],

    metrics: {
      views: 8,
      downloads: 2,
      edits: 2,
      exportAttempts: 0,
    },

    auditLogs: [
      {
        id: 'log-201',
        user: { ar: 'سعد عبد الرحمن الخالدي', en: 'Saad Abdulrahman Al-Khalidi' },
        role: { ar: 'أخصائي مطابقة فواتير', en: 'Invoice Reconciliation Specialist' },
        action: { ar: 'إنشاء مذكرة تسوية وإرفاق المستندات البنكية', en: 'Created a settlement memo and attached the bank documents' },
        timestamp: '2026-09-21 01:10:00',
        ip: '10.20.1.15',
        device: { ar: 'محطة العمل المكتبية 12', en: 'Office workstation 12' },
        hashVerified: true,
      },
      {
        id: 'log-202',
        user: { ar: 'أمل مساعد المطيري', en: 'Amal Musaed Al-Mutairi' },
        role: { ar: 'محاسب مدفوعات', en: 'Payments Accountant' },
        action: {
          ar: 'طلب نشر وتوثيق رسمي مستعجل دون اكتمال دورة التدقيق الداخلي',
          en: 'Requested urgent official publishing and certification before the internal audit cycle was complete',
        },
        timestamp: '2026-09-21 02:38:00',
        ip: '10.20.1.22',
        device: { ar: 'محطة العمل المكتبية 04', en: 'Office workstation 04' },
        isFlagged: true,
        flagReason: { ar: 'إنذار أصفر: اطلاع شخصين فقط وطلب نشر مباشر', en: 'Yellow alert: only two viewers and a direct publishing request' },
        hashVerified: true,
      },
    ],

    signatures: [
      {
        id: 'sig-201',
        name: { ar: 'سعد عبد الرحمن الخالدي', en: 'Saad Abdulrahman Al-Khalidi' },
        title: { ar: 'أخصائي مطابقة فواتير', en: 'Invoice Reconciliation Specialist' },
        avatar: 'SK',
        department: { ar: 'المالية', en: 'Finance' },
        status: 'approved',
        timestamp: { ar: '2026-09-21 01:25 م', en: '2026-09-21 01:25 PM' },
      },
      {
        id: 'sig-202',
        name: { ar: 'أمل مساعد المطيري', en: 'Amal Musaed Al-Mutairi' },
        title: { ar: 'محاسب مدفوعات', en: 'Payments Accountant' },
        avatar: 'AM',
        department: { ar: 'المالية', en: 'Finance' },
        status: 'approved',
        timestamp: { ar: '2026-09-21 02:35 م', en: '2026-09-21 02:35 PM' },
      },
      {
        id: 'sig-203',
        name: { ar: 'د. طارق المنصور', en: 'Dr. Tariq Al-Mansour' },
        title: { ar: 'رئيس قسم المالية والميزانية', en: 'Head of Finance & Budget' },
        avatar: 'TM',
        department: { ar: 'المالية', en: 'Finance' },
        status: 'pending',
        timestamp: { ar: 'في انتظار نتائج التحقيق الإداري', en: 'Awaiting the administrative investigation results' },
      },
    ],

    evidences: [
      {
        id: 'ev-201',
        timestamp: { ar: '02:38 م', en: '02:38 PM' },
        user: { ar: 'أمل مساعد المطيري (محاسب مدفوعات)', en: 'Amal Musaed Al-Mutairi (Payments Accountant)' },
        actionTitle: { ar: 'طلب نشر استثنائي دون اكتمال دورة التوقيعات', en: 'Exceptional publishing request before the signature cycle was complete' },
        description: {
          ar: 'المستند لم يمر على المراجع الداخلي، واطلع عليه شخصان فقط من أصل 4 مستويات مصرحة.',
          en: 'The document did not pass through the internal reviewer, and only two of the 4 authorized levels viewed it.',
        },
        anomalyType: 'bypassed_signatures',
        riskScore: 58,
        ipAddress: '10.20.1.22',
        location: { ar: 'المقر الرئيسي (الرياض)', en: 'Headquarters (Riyadh)' },
        hashBefore: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01',
        hashAfter: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01',
      },
    ],

    aiAnalysis: {
      summary: {
        ar: 'رصد النظام خللاً إجرائياً يتمثل في طلب اعتماد ونشر سريع لمذكرة تسوية مالية بعد اطلاع شخصين فقط، ودون إكمال توقيع مراجع الحسابات ومدير الميزانية.',
        en: 'The system detected a procedural flaw: a rushed approval and publishing request for a financial settlement memo after only two people viewed it, without the auditor’s and budget director’s signatures.',
      },
      detectedConflicts: [
        { ar: 'المستند اطلع عليه شخصان فقط داخل القسم المالي وطُلب نشره فوراً.', en: 'Only two people in the finance section viewed the document before immediate publishing was requested.' },
        { ar: 'غياب توقيع المراجعة والتدقيق الداخلي المستقل.', en: 'No independent review and internal audit signature.' },
        { ar: 'عدم وجود تعارض مصالح مؤكد ولكن يوجد خرق للائحة تفويض الصلاحيات.', en: 'No confirmed conflict of interest, but the Delegation of Authority Regulation was breached.' },
      ],
      legalArticles: [
        { ar: 'المادة (8) من لائحة الرقابة والضبط المالي الداخلي.', en: 'Article (8) of the Internal Financial Control Regulation.' },
        { ar: 'المادة (14) من مصفوفة الصلاحيات المالية للمبالغ التي تتجاوز مليون ريال.', en: 'Article (14) of the Financial Authority Matrix for amounts exceeding SAR 1 million.' },
      ],
      recommendedAction: {
        ar: 'استكمال التحقيق بواسطة رئيس القسم د. طارق المنصور، ومقابلة الموظفين قبل منح الموافقة المشروطة.',
        en: 'Department head Dr. Tariq Al-Mansour should complete the investigation and interview the employees before granting conditional approval.',
      },
    },
    // Under review: publishing requested after only 2 of 4 required signatures
    riskInput: {
      record_id: 'YQ-8841',
      tender_value_amount: 1240000,
      tender_value_currency: 'SAR',
      lot_count: 1,
      bid_count: 3,
      tenderer_count: 3,
      award_count: 1,
      supplier_count: 1,
      document_count: 4,
      findings: [
        {
          rule_id: 'DOC_001',
          status: 'weak_signal',
          manifestation: 'Urgent publishing and certification requested after only 2 of 4 required signatures; the internal audit review was not completed.',
          evidence_references: ['log-202', 'ev-201'],
        },
      ],
    },
  },

  // 3. Green Alert Document (#DOC-2026-03) - آمن (معتمد ومطابق للحوكمة)
  {
    id: 'doc-3',
    code: '#DOC-2026-03',
    title: { ar: 'ميزانية التشغيل السنوية والخطة المالية', en: 'Annual Operating Budget & Financial Plan' },
    category: { ar: 'الميزانيات والخطط المالية', en: 'Budgets & Financial Plans' },
    department: { ar: 'إدارة الموارد المالية', en: 'Financial Resources Department' },
    responsibleDeptHead: { ar: 'د. طارق المنصور (مدير إدارة الموارد المالية)', en: 'Dr. Tariq Al-Mansour (Director of Financial Resources)' },
    budget: { ar: '28,000,000 ر.س', en: 'SAR 28,000,000' },
    creationDate: '2026-08-10 09:00:00',
    lastModified: { ar: '2026-09-18 10:15 ص', en: '2026-09-18 10:15 AM' },
    status: 'published',
    riskLevel: 'safe',
    riskScore: 4,
    tags: [
      { ar: '🟢 مؤشر أخضر: آمن وسليم', en: '🟢 Green indicator: safe and sound' },
      { ar: 'اعتماد مكتمل - مطابق للحوكمة', en: 'Approval complete — governance compliant' },
      { ar: 'تواقيع مكتملة بنجاح', en: 'Signatures successfully completed' },
      { ar: 'معتمد وجاهز للتنفيذ', en: 'Approved & ready for execution' },
    ],

    // نظام الحوكمة وتتبع مسار التواقيع
    governance: {
      passCount: 16,
      viewersCount: 6,
      signaturesCount: 3,
      requiredSignaturesCount: 3,
      hasSeniorExecutiveSignature: true,
      isSequenceCompliant: true,
      speedAnomaly: false,

      platformApprovalStatus: 'auto_approved',
      approvalDecisionText: {
        ar: '🟢 منحت المنصة موافقة تلقائية على النشر والتوثيق الرسمي بفضل اكتمال مصفوفة التواقيع ومطابقة الحوكمة',
        en: '🟢 The platform granted automatic approval for official publishing and certification thanks to a complete signature matrix and governance compliance',
      },
      assignedAuthority: { ar: 'منظومة يقظة للتوثيق الرقمي المعتمد', en: 'Yaqadha Certified Digital Authentication System' },
      actionDetails: [
        {
          ar: 'اكتمال كافة التواقيع المطلوبة (إدارة الموارد المالية، الشؤون القانونية، وموافقة رئيس القسم).',
          en: 'All required signatures completed (Financial Resources Department, Legal Affairs, and department head approval).',
        },
        {
          ar: 'استيفاء سجل الاطلاع الداخلي بنجاح والتأكد من مطابقة بنود الميزانية للوائح الحوكمة.',
          en: 'Internal access log successfully completed and budget items verified against governance regulations.',
        },
        {
          ar: 'إصدار ختم التوثيق الرقمي والباركود المشفر تلقائياً وتفعيل النشر في السجل الرسمي للمنظومة.',
          en: 'Digital certification seal and encrypted barcode issued automatically, and publishing activated in the platform’s official registry.',
        },
      ],
    },

    // سجل من اطلع عليه
    viewers: [
      {
        id: 'v-301',
        name: { ar: 'د. طارق المنصور', en: 'Dr. Tariq Al-Mansour' },
        role: { ar: 'مدير إدارة الموارد المالية', en: 'Director of Financial Resources' },
        department: { ar: 'إدارة الموارد المالية', en: 'Financial Resources Department' },
        viewedAt: { ar: '2026-09-18 09:15 ص', en: '2026-09-18 09:15 AM' },
        timeSpent: { ar: 'ساعتان وتدقيق مالي شامل', en: '2 hours with a comprehensive financial audit' },
        ip: '10.10.2.14',
      },
      {
        id: 'v-302',
        name: { ar: 'أ. نورة الشمري', en: 'Ms. Noura Al-Shammari' },
        role: { ar: 'المستشار القانوني العام', en: 'General Legal Counsel' },
        department: { ar: 'الشؤون القانونية', en: 'Legal Affairs' },
        viewedAt: { ar: '2026-09-18 11:30 ص', en: '2026-09-18 11:30 AM' },
        timeSpent: { ar: 'ساعة و 45 دقيقة', en: '1 hour 45 minutes' },
        ip: '10.10.5.20',
      },
      {
        id: 'v-303',
        name: { ar: 'د. عبد الله الغامدي', en: 'Dr. Abdullah Al-Ghamdi' },
        role: { ar: 'رئيس القسم ونائب الرئيس التنفيذي', en: 'Department Head & Deputy CEO' },
        department: { ar: 'الإدارة العليا', en: 'Executive Management' },
        viewedAt: { ar: '2026-09-18 02:45 م', en: '2026-09-18 02:45 PM' },
        timeSpent: { ar: '45 دقيقة واعتماد نهائي', en: '45 minutes with final approval' },
        ip: '10.10.1.2',
      },
    ],

    signatureSteps: [
      {
        step: 1,
        roleTitle: { ar: 'مدير إدارة الموارد المالية (اعتماد مالي)', en: 'Director of Financial Resources (Financial Approval)' },
        officerName: { ar: 'د. طارق المنصور', en: 'Dr. Tariq Al-Mansour' },
        department: { ar: 'إدارة الموارد المالية', en: 'Financial Resources Department' },
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-09-18 09:15 ص', en: '2026-09-18 09:15 AM' },
        orderCompliant: true,
        notes: { ar: 'اكتمال مخصصات الميزانية ومطابقة الخطة المالية', en: 'Budget allocations complete and financial plan reconciled' },
      },
      {
        step: 2,
        roleTitle: { ar: 'المستشار القانوني العام (مطابقة نظامية)', en: 'General Legal Counsel (Regulatory Compliance)' },
        officerName: { ar: 'أ. نورة الشمري', en: 'Ms. Noura Al-Shammari' },
        department: { ar: 'الشؤون القانونية', en: 'Legal Affairs' },
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-09-18 11:30 ص', en: '2026-09-18 11:30 AM' },
        orderCompliant: true,
        notes: { ar: 'سلامة الصياغة النظامية ومطابقة اللوائح', en: 'Sound regulatory drafting and compliance with regulations' },
      },
      {
        step: 3,
        roleTitle: { ar: 'رئيس القسم / الإدارة العليا (اعتماد نهائي)', en: 'Department Head / Executive Management (Final Approval)' },
        officerName: { ar: 'د. عبد الله الغامدي', en: 'Dr. Abdullah Al-Ghamdi' },
        department: { ar: 'الإدارة العليا', en: 'Executive Management' },
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: { ar: '2026-09-18 02:45 م', en: '2026-09-18 02:45 PM' },
        orderCompliant: true,
        notes: { ar: 'موافقة رئيس القسم والاعتماد النهائي وجاهز للتنفيذ', en: 'Department head approval and final sign-off; ready for execution' },
      },
    ],

    metrics: {
      views: 34,
      downloads: 12,
      edits: 4,
      exportAttempts: 0,
    },

    auditLogs: [
      {
        id: 'log-301',
        user: { ar: 'م. سلمان فهد الدوسري', en: 'Eng. Salman Fahad Al-Dosari' },
        role: { ar: 'مهندس شبكات أول', en: 'Senior Network Engineer' },
        action: { ar: 'رفع الكراسة الفنية للمراجعة الأولية', en: 'Uploaded the technical booklet for initial review' },
        timestamp: '2026-08-15 11:30:00',
        ip: '10.10.4.12',
        device: { ar: 'محطة العمل 84', en: 'Workstation 84' },
        hashVerified: true,
      },
      {
        id: 'log-302',
        user: { ar: 'أ. خالد السليمان', en: 'Mr. Khalid Al-Sulaiman' },
        role: { ar: 'مدير عام تقنية المعلومات', en: 'General Manager of Information Technology' },
        action: { ar: 'المصادقة الإشرافية والتأكيد على مطابقة معايير الحوكمة', en: 'Supervisory endorsement confirming compliance with governance standards' },
        timestamp: '2026-09-05 15:00:00',
        ip: '10.10.1.5',
        device: { ar: 'جهاز الإدارة المكتبي', en: 'Management office computer' },
        hashVerified: true,
      },
      {
        id: 'log-303',
        user: { ar: 'د. عبد الله الغامدي', en: 'Dr. Abdullah Al-Ghamdi' },
        role: { ar: 'نائب الرئيس التنفيذي للتشغيل', en: 'Deputy CEO for Operations' },
        action: { ar: 'التوقيع والاعتماد النهائي في السلسلة الإجرائية', en: 'Final signature and approval in the procedural chain' },
        timestamp: '2026-09-18 10:15:00',
        ip: '10.10.1.2',
        device: { ar: 'الجهاز اللوحي القيادي المشفر', en: 'Encrypted executive tablet' },
        hashVerified: true,
      },
      {
        id: 'log-304',
        user: { ar: 'نظام يقظة للحوكمة التلقائية', en: 'Yaqadha Automated Governance System' },
        role: { ar: 'محرك الرقابة الذكي', en: 'Smart Oversight Engine' },
        action: {
          ar: 'منح الموافقة التلقائية على النشر وإصدار وثيقة التوثيق الرقمي الرسمية',
          en: 'Granted automatic publishing approval and issued the official digital certification document',
        },
        timestamp: '2026-09-18 10:15:02',
        ip: '127.0.0.1',
        device: { ar: 'خادم الأمان المشفر', en: 'Encrypted security server' },
        hashVerified: true,
      },
    ],

    signatures: [
      {
        id: 'sig-301',
        name: { ar: 'د. طارق المنصور', en: 'Dr. Tariq Al-Mansour' },
        title: { ar: 'مدير إدارة الموارد المالية', en: 'Director of Financial Resources' },
        avatar: 'TM',
        department: { ar: 'إدارة الموارد المالية', en: 'Financial Resources Department' },
        status: 'approved',
        timestamp: { ar: '2026-09-18 09:15 ص', en: '2026-09-18 09:15 AM' },
      },
      {
        id: 'sig-302',
        name: { ar: 'أ. نورة الشمري', en: 'Ms. Noura Al-Shammari' },
        title: { ar: 'المستشار القانوني العام', en: 'General Legal Counsel' },
        avatar: 'NS',
        department: { ar: 'الشؤون القانونية', en: 'Legal Affairs' },
        status: 'approved',
        timestamp: { ar: '2026-09-18 11:30 ص', en: '2026-09-18 11:30 AM' },
      },
      {
        id: 'sig-303',
        name: { ar: 'د. عبد الله الغامدي', en: 'Dr. Abdullah Al-Ghamdi' },
        title: { ar: 'رئيس القسم ونائب الرئيس التنفيذي', en: 'Department Head & Deputy CEO' },
        avatar: 'AG',
        department: { ar: 'الإدارة العليا', en: 'Executive Management' },
        status: 'approved',
        timestamp: { ar: '2026-09-18 02:45 م', en: '2026-09-18 02:45 PM' },
      },
    ],

    evidences: [],

    aiAnalysis: {
      summary: {
        ar: 'أظهر الفحص الاستباقي سلامة تامة لمسار التوقيعات، حيث استوفت الوثيقة التدقيق الفني والمالي مع وجود توقيعات الرؤساء الكبار، وتدرج زمني طبيعي دون أي تسريع غير مبرر.',
        en: 'The proactive scan showed a fully sound signature path: the document passed technical and financial review with senior executive signatures and a normal timeline without any unjustified acceleration.',
      },
      detectedConflicts: [],
      legalArticles: [
        { ar: 'المطابقة التامة للمادة (12) من لائحة الحوكمة والاعتماد الرقمي.', en: 'Full compliance with Article (12) of the Governance & Digital Approval Regulation.' },
        { ar: 'استيفاء معايير الرقابة الداخلية وإبراء الذمة الإدارية.', en: 'Internal control criteria met and administrative clearance granted.' },
      ],
      recommendedAction: {
        ar: 'تم النشر التلقائي واعتماد الوثيقة في السجل الرسمي للمنظومة.',
        en: 'The document was automatically published and approved in the platform’s official registry.',
      },
    },
    // Approved: complete, governance-compliant signature path — no findings
    riskInput: {
      record_id: 'DOC-2026-03',
      tender_value_amount: 28000000,
      tender_value_currency: 'SAR',
      lot_count: 1,
      bid_count: 5,
      tenderer_count: 5,
      award_count: 1,
      supplier_count: 1,
      document_count: 12,
      findings: [],
    },
  },
];

/** Demo documents resolved to the given language (same DocumentDossier shape the UI already uses). */
export const getDocuments = (lang: Lang): DocumentDossier[] =>
  localize<DocumentDossier[]>(initialDocuments, lang);
