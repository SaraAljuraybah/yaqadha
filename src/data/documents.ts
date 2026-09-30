import { DocumentDossier } from '../types';

export const initialDocuments: DocumentDossier[] = [
  // 1. Red Alert Document (#DOC-2026-01) - محظور (توقيع منفرد)
  {
    id: 'doc-1',
    code: '#DOC-2026-01',
    title: 'كراسة الشروط والمواصفات لمشروع التوسع التقني',
    category: 'مناقصات ومشاريع تقنية',
    department: 'إدارة تقنية المعلومات',
    responsibleDeptHead: 'أ. أحمد الخالد (مدير إدارة تقنية المعلومات)',
    budget: '14,500,000 ر.س',
    creationDate: '2026-09-15 08:30:00',
    lastModified: '2026-09-15 08:32:19',
    status: 'blocked',
    riskLevel: 'blocked',
    riskScore: 94,
    tags: ['🔴 توقيع منفرد', 'تسريع غير منطقي', 'محال لمعالي رئيس المنظومة'],

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
      approvalDecisionText: '🔴 تم حظر النشر منعاً باتاً وتصعيد الملف فوراً لمعالي رئيس المنظومة بسبب رصد توقيع منفرد وتخطي مسار الحوكمة',
      assignedAuthority: 'معالي رئيس المنظومة ورئيس مجلس الإدارة',
      actionDetails: [
        'رصد توقيع منفرد: اعتماد ونشر فوري بواسطة شخص واحد (أ. أحمد الخالد) دون استكمال التواقيع الإلزامية.',
        'غياب التواقيع الإلزامية لرؤساء الإدارات (المالية والقانونية والقيادية).',
        'تم تجميد المستند نهائياً ورفع التقرير الاستباقي لمكتب رئيس المنظومة.',
        'يُمنع منعاً باتاً نشر هذا المستند أو توثيقه مستقبلاً بموجب قرار المنصة التلقائي.'
      ]
    },

    // سجل من اطلع عليه
    viewers: [
      {
        id: 'v-1',
        name: 'أ. أحمد الخالد',
        role: 'مدير إدارة تقنية المعلومات (المُعد)',
        department: 'إدارة تقنية المعلومات',
        viewedAt: '2026-09-15 08:30:00',
        timeSpent: 'دقيقتان و 19 ثانية (تسريع مريب)',
        ip: '192.168.10.45 (عبر VPN)'
      }
    ],

    // مصفوفة وترتيب التواقيع
    signatureSteps: [
      {
        step: 1,
        roleTitle: 'المُعد ومسؤول الكراسة',
        officerName: 'أ. أحمد الخالد',
        department: 'إدارة تقنية المعلومات',
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: '2026-09-15 08:32:19',
        orderCompliant: true,
        notes: 'توقيع منفرد أحادي تم رصده وتجميده'
      },
      {
        step: 2,
        roleTitle: 'رئيس قسم الميزانية والتدقيق المالي',
        officerName: 'د. طارق المنصور',
        department: 'الشؤون المالية',
        isSeniorExecutive: true,
        status: 'bypassed',
        orderCompliant: false,
        notes: '⚠️ تم تخطي التوقيع عمداً وتمرير الملف للنشر'
      },
      {
        step: 3,
        roleTitle: 'المستشار القانوني العام',
        officerName: 'أ. نورة الشمري',
        department: 'الإدارة القانونية',
        isSeniorExecutive: true,
        status: 'bypassed',
        orderCompliant: false,
        notes: '⚠️ تم تخطي المراجعة النظامية'
      },
      {
        step: 4,
        roleTitle: 'نائب الرئيس التنفيذي للمشاريع',
        officerName: 'د. عبد الله الغامدي',
        department: 'الإدارة العليا',
        isSeniorExecutive: true,
        status: 'bypassed',
        orderCompliant: false,
        notes: '⚠️ تم تخطي الاعتماد القيادي الأعلى'
      }
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
        user: 'أ. أحمد الخالد',
        role: 'مدير إدارة تقنية المعلومات (المُعد)',
        action: 'طلب نشر واعتماد فوري لكراسة الشروط بتوقيع منفرد وتخطي التواقيع الرقابية',
        timestamp: '2026-09-15 08:32:19',
        ip: '192.168.10.45',
        device: 'محطة العمل 02 عبر VPN',
        isFlagged: true,
        flagReason: 'توقيع منفرد وتخطي 3 مستويات رقابية إلزامية',
        hashVerified: false,
      }
    ],

    signatures: [
      {
        id: 'sig-1',
        name: 'أ. أحمد الخالد',
        title: 'مدير إدارة تقنية المعلومات (المُعد)',
        avatar: 'AK',
        department: 'إدارة تقنية المعلومات',
        status: 'approved',
        timestamp: '2026-09-15 08:32',
      },
      {
        id: 'sig-2',
        name: 'د. طارق المنصور',
        title: 'رئيس قسم المالية والميزانية',
        avatar: 'TM',
        department: 'المالية',
        status: 'blocked',
        timestamp: 'تم التخطي غير المصرح به',
      },
      {
        id: 'sig-3',
        name: 'أ. نورة الشمري',
        title: 'المستشار القانوني العام',
        avatar: 'NS',
        department: 'القانونية',
        status: 'blocked',
        timestamp: 'تم التخطي غير المصرح به',
      },
      {
        id: 'sig-4',
        name: 'د. عبد الله الغامدي',
        title: 'نائب الرئيس التنفيذي',
        avatar: 'AG',
        department: 'الإدارة العليا',
        status: 'blocked',
        timestamp: 'تم التخطي غير المصرح به',
      }
    ],

    evidences: [
      {
        id: 'ev-1',
        timestamp: '08:32:19 ص',
        user: 'أ. أحمد الخالد (المُعد)',
        actionTitle: 'رصد توقيع منفرد وتخطي سلسلة التواقيع القيادية',
        description: 'اطلع شخص واحد فقط على الكراسة (#DOC-2026-01) وطُلب نشرها بتوقيع منفرد متجاوزاً مستويات التدقيق الإلزامية.',
        anomalyType: 'bypassed_signatures',
        riskScore: 98,
        ipAddress: '192.168.10.45',
        location: 'الرياض (شبكة VPN)',
        hashBefore: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        hashAfter: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      }
    ],

    aiAnalysis: {
      summary: 'رصد نظام يقظة تسريعاً غير مبرر ومحاولة نشر كراسة الشروط والمواصفات لمشروع التوسع التقني (#DOC-2026-01) بتوقيع منفرد من المُعد أ. أحمد الخالد، مع تخطي 3 مستويات تدقيق رئيسية.',
      detectedConflicts: [
        'تسريع شاذ وتخطي التواقيع الإلزامية: طلب نشر الكراسة بتوقيع منفرد لشخص واحد في دقيقتين.',
        'غياب الاعتماد المالي والتدقيق القانوني المستقل.',
        'تعديل وإرسال خارج الأطر الإجرائية النظامية.'
      ],
      legalArticles: [
        'المادة (16) من نظام مكافحة الفساد وتعارض المصالح الحكومي والشركات.',
        'المادة (43) من لائحة المنافسات والمشتريات: اشتراط سلامة التدرج الرقابي والتواقيع المتسلسلة.',
        'المادة (24) من لائحة الانضباط الوظيفي وقواعد تدقيق النزاهة المؤسسية.'
      ],
      recommendedAction: 'تأكيد الحظر الأبدي للنشر، والإحالة الجنائية الفورية إلى معالي رئيس المنظومة وهيئة الرقابة ومكافحة الفساد مع تجميد الصلاحيات.'
    }
  },

  // 2. Amber Alert Document (#YQ-8841) - اشتباه (خلل إجرائي: مر على شخصين فقط وطُلب نشره فوراً)
  {
    id: 'doc-2',
    code: '#YQ-8841',
    title: 'عقد توريد أجهزة ومعدات شبكات',
    category: 'تسويات مالية ومستحقات',
    department: 'قسم المالية والميزانية',
    responsibleDeptHead: 'د. طارق المنصور (رئيس قسم المالية والميزانية)',
    budget: '1,240,000 ر.س',
    creationDate: '2026-09-19 11:15:00',
    lastModified: 'أمس 02:40 م',
    status: 'under_review',
    riskLevel: 'review',
    riskScore: 58,
    tags: ['🟡 إنذار أصفر: خلل إجرائي', 'اطلع عليه شخصان فقط', 'طلب نشر فوري مستعجل', 'محال لرئيس قسم المالية'],

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
      approvalDecisionText: '🟡 تم تسجيل الواقعة وإعادة توجيه المستند تلقائياً إلى رئيس قسم المالية والميزانية للتحقيق والاستيضاح',
      assignedAuthority: 'د. طارق المنصور (رئيس قسم المالية والميزانية)',
      actionDetails: [
        'تسجيل كافة تفاصيل المسار: من اطلع (سعد الخالدي، أمل المطيري) ومن وقع.',
        'إعادة توجيه المستند تلقائياً لبريد ولوحة تحكم رئيس قسم المالية والميزانية مع كشف كامل بالأسماء.',
        'توجيه رئيس القسم لعقد اجتماع تحقيق مع المعنيين لبحث أسباب محاولة الاستعجال غير المبرر.',
        'المستند يمكن أن يُنشر لاحقاً فقط بعد معالجة الخلل، اكتمال التواقيع، واعتماد رئيس القسم.'
      ]
    },

    // سجل من اطلع عليه
    viewers: [
      {
        id: 'v-201',
        name: 'سعد عبد الرحمن الخالدي',
        role: 'أخصائي مطابقة فواتير',
        department: 'قسم المالية والميزانية',
        viewedAt: '2026-09-21 01:10 م',
        timeSpent: '12 دقيقة',
        ip: '10.20.1.15 (الشبكة الداخلية)'
      },
      {
        id: 'v-202',
        name: 'أمل مساعد المطيري',
        role: 'محاسب مدفوعات',
        department: 'قسم المالية والميزانية',
        viewedAt: '2026-09-21 02:25 م',
        timeSpent: '8 دقائق',
        ip: '10.20.1.22 (الشبكة الداخلية)'
      }
    ],

    signatureSteps: [
      {
        step: 1,
        roleTitle: 'أخصائي مطابقة الفواتير',
        officerName: 'سعد عبد الرحمن الخالدي',
        department: 'الشؤون المالية',
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: '2026-09-21 01:25 م',
        orderCompliant: true,
        notes: 'إعداد أولي'
      },
      {
        step: 2,
        roleTitle: 'محاسب المدفوعات',
        officerName: 'أمل مساعد المطيري',
        department: 'الشؤون المالية',
        isSeniorExecutive: false,
        status: 'signed',
        signedAt: '2026-09-21 02:35 م',
        orderCompliant: true,
        notes: 'توقيع تالي مع طلب نشر وتوثيق فوري'
      },
      {
        step: 3,
        roleTitle: 'رئيس قسم المراجعة والتدقيق الداخلي',
        officerName: 'أ. منصور القرني',
        department: 'المراجعة الداخلية',
        isSeniorExecutive: false,
        status: 'pending',
        orderCompliant: false,
        notes: '⏳ مطلوب توقيعه قبل أي اعتماد'
      },
      {
        step: 4,
        roleTitle: 'رئيس قسم المالية والميزانية',
        officerName: 'د. طارق المنصور',
        department: 'قسم المالية والميزانية',
        isSeniorExecutive: true,
        status: 'pending',
        orderCompliant: false,
        notes: '⏳ محال لمكتبه للتحقيق واعتماد النشر'
      }
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
        user: 'سعد عبد الرحمن الخالدي',
        role: 'أخصائي مطابقة فواتير',
        action: 'إنشاء مذكرة تسوية وإرفاق المستندات البنكية',
        timestamp: '2026-09-21 01:10:00',
        ip: '10.20.1.15',
        device: 'محطة العمل المكتبية 12',
        hashVerified: true,
      },
      {
        id: 'log-202',
        user: 'أمل مساعد المطيري',
        role: 'محاسب مدفوعات',
        action: 'طلب نشر وتوثيق رسمي مستعجل دون اكتمال دورة التدقيق الداخلي',
        timestamp: '2026-09-21 02:38:00',
        ip: '10.20.1.22',
        device: 'محطة العمل المكتبية 04',
        isFlagged: true,
        flagReason: 'إنذار أصفر: اطلاع شخصين فقط وطلب نشر مباشر',
        hashVerified: true,
      }
    ],

    signatures: [
      {
        id: 'sig-201',
        name: 'سعد عبد الرحمن الخالدي',
        title: 'أخصائي مطابقة فواتير',
        avatar: 'SK',
        department: 'المالية',
        status: 'approved',
        timestamp: '2026-09-21 01:25 م',
      },
      {
        id: 'sig-202',
        name: 'أمل مساعد المطيري',
        title: 'محاسب مدفوعات',
        avatar: 'AM',
        department: 'المالية',
        status: 'approved',
        timestamp: '2026-09-21 02:35 م',
      },
      {
        id: 'sig-203',
        name: 'د. طارق المنصور',
        title: 'رئيس قسم المالية والميزانية',
        avatar: 'TM',
        department: 'المالية',
        status: 'pending',
        timestamp: 'في انتظار نتائج التحقيق الإداري',
      }
    ],

    evidences: [
      {
        id: 'ev-201',
        timestamp: '02:38 م',
        user: 'أمل مساعد المطيري (محاسب مدفوعات)',
        actionTitle: 'طلب نشر استثنائي دون اكتمال دورة التوقيعات',
        description: 'المستند لم يمر على المراجع الداخلي، واطلع عليه شخصان فقط من أصل 4 مستويات مصرحة.',
        anomalyType: 'bypassed_signatures',
        riskScore: 58,
        ipAddress: '10.20.1.22',
        location: 'المقر الرئيسي (الرياض)',
        hashBefore: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01',
        hashAfter: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01',
      }
    ],

    aiAnalysis: {
      summary: 'رصد النظام خللاً إجرائياً يتمثل في طلب اعتماد ونشر سريع لمذكرة تسوية مالية بعد اطلاع شخصين فقط، ودون إكمال توقيع مراجع الحسابات ومدير الميزانية.',
      detectedConflicts: [
        'المستند اطلع عليه شخصان فقط داخل القسم المالي وطُلب نشره فوراً.',
        'غياب توقيع المراجعة والتدقيق الداخلي المستقل.',
        'عدم وجود تعارض مصالح مؤكد ولكن يوجد خرق للائحة تفويض الصلاحيات.'
      ],
      legalArticles: [
        'المادة (8) من لائحة الرقابة والضبط المالي الداخلي.',
        'المادة (14) من مصفوفة الصلاحيات المالية للمبالغ التي تتجاوز مليون ريال.'
      ],
      recommendedAction: 'استكمال التحقيق بواسطة رئيس القسم د. طارق المنصور، ومقابلة الموظفين قبل منح الموافقة المشروطة.'
    }
  },

  // 3. Green Alert Document (#DOC-2026-03) - آمن (معتمد ومطابق للحوكمة)
  {
    id: 'doc-3',
    code: '#DOC-2026-03',
    title: 'ميزانية التشغيل السنوية والخطة المالية',
    category: 'الميزانيات والخطط المالية',
    department: 'إدارة الموارد المالية',
    responsibleDeptHead: 'د. طارق المنصور (مدير إدارة الموارد المالية)',
    budget: '28,000,000 ر.س',
    creationDate: '2026-08-10 09:00:00',
    lastModified: '2026-09-18 10:15 ص',
    status: 'published',
    riskLevel: 'safe',
    riskScore: 4,
    tags: ['🟢 مؤشر أخضر: آمن وسليم', 'اعتماد مكتمل - مطابق للحوكمة', 'تواقيع مكتملة بنجاح', 'معتمد وجاهز للتنفيذ'],

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
      approvalDecisionText: '🟢 منحت المنصة موافقة تلقائية على النشر والتوثيق الرسمي بفضل اكتمال مصفوفة التواقيع ومطابقة الحوكمة',
      assignedAuthority: 'منظومة يقظة للتوثيق الرقمي المعتمد',
      actionDetails: [
        'اكتمال كافة التواقيع المطلوبة (إدارة الموارد المالية، الشؤون القانونية، وموافقة رئيس القسم).',
        'استيفاء سجل الاطلاع الداخلي بنجاح والتأكد من مطابقة بنود الميزانية للوائح الحوكمة.',
        'إصدار ختم التوثيق الرقمي والباركود المشفر تلقائياً وتفعيل النشر في السجل الرسمي للمنظومة.'
      ]
    },

    // سجل من اطلع عليه
    viewers: [
      {
        id: 'v-301',
        name: 'د. طارق المنصور',
        role: 'مدير إدارة الموارد المالية',
        department: 'إدارة الموارد المالية',
        viewedAt: '2026-09-18 09:15 ص',
        timeSpent: 'ساعتان وتدقيق مالي شامل',
        ip: '10.10.2.14'
      },
      {
        id: 'v-302',
        name: 'أ. نورة الشمري',
        role: 'المستشار القانوني العام',
        department: 'الشؤون القانونية',
        viewedAt: '2026-09-18 11:30 ص',
        timeSpent: 'ساعة و 45 دقيقة',
        ip: '10.10.5.20'
      },
      {
        id: 'v-303',
        name: 'د. عبد الله الغامدي',
        role: 'رئيس القسم ونائب الرئيس التنفيذي',
        department: 'الإدارة العليا',
        viewedAt: '2026-09-18 02:45 م',
        timeSpent: '45 دقيقة واعتماد نهائي',
        ip: '10.10.1.2'
      }
    ],

    signatureSteps: [
      {
        step: 1,
        roleTitle: 'مدير إدارة الموارد المالية (اعتماد مالي)',
        officerName: 'د. طارق المنصور',
        department: 'إدارة الموارد المالية',
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: '2026-09-18 09:15 ص',
        orderCompliant: true,
        notes: 'اكتمال مخصصات الميزانية ومطابقة الخطة المالية'
      },
      {
        step: 2,
        roleTitle: 'المستشار القانوني العام (مطابقة نظامية)',
        officerName: 'أ. نورة الشمري',
        department: 'الشؤون القانونية',
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: '2026-09-18 11:30 ص',
        orderCompliant: true,
        notes: 'سلامة الصياغة النظامية ومطابقة اللوائح'
      },
      {
        step: 3,
        roleTitle: 'رئيس القسم / الإدارة العليا (اعتماد نهائي)',
        officerName: 'د. عبد الله الغامدي',
        department: 'الإدارة العليا',
        isSeniorExecutive: true,
        status: 'signed',
        signedAt: '2026-09-18 02:45 م',
        orderCompliant: true,
        notes: 'موافقة رئيس القسم والاعتماد النهائي وجاهز للتنفيذ'
      }
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
        user: 'م. سلمان فهد الدوسري',
        role: 'مهندس شبكات أول',
        action: 'رفع الكراسة الفنية للمراجعة الأولية',
        timestamp: '2026-08-15 11:30:00',
        ip: '10.10.4.12',
        device: 'محطة العمل 84',
        hashVerified: true,
      },
      {
        id: 'log-302',
        user: 'أ. خالد السليمان',
        role: 'مدير عام تقنية المعلومات',
        action: 'المصادقة الإشرافية والتأكيد على مطابقة معايير الحوكمة',
        timestamp: '2026-09-05 15:00:00',
        ip: '10.10.1.5',
        device: 'جهاز الإدارة المكتبي',
        hashVerified: true,
      },
      {
        id: 'log-303',
        user: 'د. عبد الله الغامدي',
        role: 'نائب الرئيس التنفيذي للتشغيل',
        action: 'التوقيع والاعتماد النهائي في السلسلة الإجرائية',
        timestamp: '2026-09-18 10:15:00',
        ip: '10.10.1.2',
        device: 'الجهاز اللوحي القيادي المشفر',
        hashVerified: true,
      },
      {
        id: 'log-304',
        user: 'نظام يقظة للحوكمة التلقائية',
        role: 'محرك الرقابة الذكي',
        action: 'منح الموافقة التلقائية على النشر وإصدار وثيقة التوثيق الرقمي الرسمية',
        timestamp: '2026-09-18 10:15:02',
        ip: '127.0.0.1',
        device: 'خادم الأمان المشفر',
        hashVerified: true,
      }
    ],

    signatures: [
      {
        id: 'sig-301',
        name: 'د. طارق المنصور',
        title: 'مدير إدارة الموارد المالية',
        avatar: 'TM',
        department: 'إدارة الموارد المالية',
        status: 'approved',
        timestamp: '2026-09-18 09:15 ص',
      },
      {
        id: 'sig-302',
        name: 'أ. نورة الشمري',
        title: 'المستشار القانوني العام',
        avatar: 'NS',
        department: 'الشؤون القانونية',
        status: 'approved',
        timestamp: '2026-09-18 11:30 ص',
      },
      {
        id: 'sig-303',
        name: 'د. عبد الله الغامدي',
        title: 'رئيس القسم ونائب الرئيس التنفيذي',
        avatar: 'AG',
        department: 'الإدارة العليا',
        status: 'approved',
        timestamp: '2026-09-18 02:45 م',
      }
    ],

    evidences: [],

    aiAnalysis: {
      summary: 'أظهر الفحص الاستباقي سلامة تامة لمسار التوقيعات، حيث استوفت الوثيقة التدقيق الفني والمالي مع وجود توقيعات الرؤساء الكبار، وتدرج زمني طبيعي دون أي تسريع غير مبرر.',
      detectedConflicts: [],
      legalArticles: [
        'المطابقة التامة للمادة (12) من لائحة الحوكمة والاعتماد الرقمي.',
        'استيفاء معايير الرقابة الداخلية وإبراء الذمة الإدارية.'
      ],
      recommendedAction: 'تم النشر التلقائي واعتماد الوثيقة في السجل الرسمي للمنظومة.'
    }
  }
];
