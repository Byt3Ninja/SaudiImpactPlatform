import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        projects: 'Projects',
        organizations: 'Organizations',
        opportunities: 'Opportunities',
        dashboard: 'Impact Dashboard',
        map: 'Map',
        search: 'Search projects...'
      },
      home: {
        hero: {
          title: 'Transforming Saudi Arabia Through Impact',
          description: 'Discover and track social and environmental impact projects across the Kingdom. Connect with organizations, explore investment opportunities, and measure sustainable development outcomes.',
          exploreProjects: 'Explore Projects',
          investmentOpportunities: 'Investment Opportunities'
        },
        stats: {
          totalProjects: 'Total Projects',
          activeInitiatives: 'Active Initiatives',
          organizations: 'Organizations',
          totalFunding: 'Total Funding'
        },
        featured: {
          title: 'Featured Projects',
          description: 'Transformative initiatives driving sustainable development'
        }
      },
      projects: {
        title: 'Impact Projects',
        description: 'Explore transformative social and environmental initiatives across Saudi Arabia',
        filters: {
          title: 'Filters',
          region: 'Region',
          status: 'Status',
          category: 'Category',
          sdg: 'SDG Goals',
          allRegions: 'All Regions',
          allStatuses: 'All Statuses',
          allCategories: 'All Categories'
        }
      },
      organizations: {
        title: 'Organizations',
        description: 'Discover the entities driving sustainable development across Saudi Arabia',
        searchPlaceholder: 'Search organizations...',
        resultsCount_one: '{{count}} organization found',
        resultsCount_other: '{{count}} organizations found',
        website: 'Website',
        view: 'View',
        noResults: 'No organizations found',
        resetFilters: 'Reset Filters',
        filters: {
          title: 'Filters',
          type: 'Organization Type',
          region: 'Region',
          allTypes: 'All Types',
          allRegions: 'All Regions'
        }
      },
      opportunities: {
        title: 'Investment Opportunities',
        description: 'Connect with impactful projects seeking funding to drive sustainable development',
        searchPlaceholder: 'Search opportunities...',
        quickStats: 'Quick Stats',
        availableOpportunities: 'Available Opportunities',
        totalFundingNeeded: 'Total Funding Needed',
        fundingProgress: 'Funding Progress',
        raised: 'raised',
        learnMore: 'Learn More',
        noResults: 'No investment opportunities found',
        resetFilters: 'Reset Filters',
        filters: {
          title: 'Filters',
          category: 'Category',
          region: 'Region',
          allCategories: 'All Categories',
          allRegions: 'All Regions'
        }
      },
      dashboard: {
        title: 'Impact Dashboard',
        description: 'Real-time insights into sustainable development across Saudi Arabia'
      },
      map: {
        title: 'Impact Map',
        description: 'Explore projects across Saudi Arabia',
        filters: {
          title: 'Filters',
          category: 'Category',
          region: 'Region'
        }
      },
      common: {
        loading: 'Loading...',
        noResults: 'No results found',
        error: 'An error occurred',
        currency: 'SAR',
        viewAll: 'View All',
        clear: 'Clear'
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        projects: 'المشاريع',
        organizations: 'المنظمات',
        opportunities: 'الفرص الاستثمارية',
        dashboard: 'لوحة التأثير',
        map: 'الخريطة',
        search: 'البحث عن المشاريع...'
      },
      home: {
        hero: {
          title: 'تحويل المملكة العربية السعودية من خلال التأثير',
          description: 'اكتشف وتابع مشاريع التأثير الاجتماعي والبيئي في جميع أنحاء المملكة. تواصل مع المنظمات، واستكشف الفرص الاستثمارية، وقِس نتائج التنمية المستدامة.',
          exploreProjects: 'استكشف المشاريع',
          investmentOpportunities: 'الفرص الاستثمارية'
        },
        stats: {
          totalProjects: 'إجمالي المشاريع',
          activeInitiatives: 'المشاريع النشطة',
          organizations: 'المنظمات',
          totalFunding: 'إجمالي التمويل'
        },
        featured: {
          title: 'المشاريع المميزة',
          description: 'المبادرات التحويلية التي تقود التنمية المستدامة'
        }
      },
      projects: {
        title: 'مشاريع التأثير',
        description: 'استكشف المبادرات الاجتماعية والبيئية التحويلية في جميع أنحاء المملكة العربية السعودية',
        filters: {
          title: 'المرشحات',
          region: 'المنطقة',
          status: 'الحالة',
          category: 'الفئة',
          sdg: 'أهداف التنمية المستدامة',
          allRegions: 'جميع المناطق',
          allStatuses: 'جميع الحالات',
          allCategories: 'جميع الفئات'
        }
      },
      organizations: {
        title: 'المنظمات',
        description: 'اكتشف الكيانات التي تقود التنمية المستدامة في جميع أنحاء المملكة العربية السعودية',
        searchPlaceholder: 'البحث عن المنظمات...',
        resultsCount_zero: 'لم يتم العثور على منظمات',
        resultsCount_one: 'تم العثور على منظمة واحدة',
        resultsCount_two: 'تم العثور على منظمتين',
        resultsCount_few: 'تم العثور على {{count}} منظمات',
        resultsCount_many: 'تم العثور على {{count}} منظمة',
        resultsCount_other: 'تم العثور على {{count}} منظمة',
        website: 'الموقع الإلكتروني',
        view: 'عرض',
        noResults: 'لم يتم العثور على منظمات',
        resetFilters: 'إعادة تعيين المرشحات',
        filters: {
          title: 'المرشحات',
          type: 'نوع المنظمة',
          region: 'المنطقة',
          allTypes: 'جميع الأنواع',
          allRegions: 'جميع المناطق'
        }
      },
      opportunities: {
        title: 'فرص الاستثمار',
        description: 'تواصل مع المشاريع المؤثرة التي تسعى للحصول على التمويل لدفع التنمية المستدامة',
        searchPlaceholder: 'البحث عن الفرص...',
        quickStats: 'إحصائيات سريعة',
        availableOpportunities: 'الفرص المتاحة',
        totalFundingNeeded: 'إجمالي التمويل المطلوب',
        fundingProgress: 'تقدم التمويل',
        raised: 'تم جمع',
        learnMore: 'اعرف المزيد',
        noResults: 'لم يتم العثور على فرص استثمارية',
        resetFilters: 'إعادة تعيين المرشحات',
        filters: {
          title: 'المرشحات',
          category: 'الفئة',
          region: 'المنطقة',
          allCategories: 'جميع الفئات',
          allRegions: 'جميع المناطق'
        }
      },
      dashboard: {
        title: 'لوحة التأثير',
        description: 'رؤى فورية حول التنمية المستدامة في جميع أنحاء المملكة العربية السعودية'
      },
      map: {
        title: 'خريطة التأثير',
        description: 'استكشف المشاريع في جميع أنحاء المملكة العربية السعودية',
        filters: {
          title: 'المرشحات',
          category: 'الفئة',
          region: 'المنطقة'
        }
      },
      common: {
        loading: 'جاري التحميل...',
        noResults: 'لم يتم العثور على نتائج',
        error: 'حدث خطأ',
        currency: 'ريال',
        viewAll: 'عرض الكل',
        clear: 'مسح'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
