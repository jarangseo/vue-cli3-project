import { httpAnalytics } from '@/shared/utils/httpaxios'
import * as types from '@/shared/stores/types'
import _ from 'lodash'

// const httpLatency = time => new Promise((resolve) => setTimeout(() => resolve(), time))
const http = httpAnalytics
export const dashboardModule = {
  state: {
    isDaily: true,
    hasRevenue: false,
    navMenuTransitionDuration: 0,
    moreDetail: {},
    glossaryBase: {},
    _realtimeEnv: {
      realtimeDateTime: ''
    },
    _aboutChart: {
      isOpen: false,
      type: '',
      areaName: '',
      chartName: '',
      data: {}
    },
    _currentDates: {
      startDate: '',
      endDate: '',
      dateCode: '',
      selectedDates: '',
      dateFormat: ''
    },
    _nowCallApiList: [],
    // objectId: 총 25개
    _apiReqObjIdList: [
      [],
      '01',
      ['', '02_01', '02_02', '02_03'],
      ['', '03_01', '03_02', '03_03', '03_04', '03_05', '03_06'],
      '04',
      '05',
      '06',
      '07',
      ['', '08_01', '08_02', '08_03', '08_04'],
      '09',
      ['', '10_01', '10_02', '10_03'],
      ['', '11_01', '11_02'],
      '12'
    ],
    // _env ->-> downloadReport 쿼리스트링 순서
    // baseYmd&beforeYmd&currencyCd&dashboardId&merged&objectId&prjId&serviceType&objectName|
    // baseYmd&beforeYmd&currencyCd&dashboardId&merged&objectId&prjId&serviceType&objectName|
    // baseYmd&beforeYmd&currencyCd&dashboardId&merged&objectId&prjId&serviceType&objectName|
    // baseYmd&beforeYmd&currencyCd&dashboardId&merged&objectId&prjId&serviceType&objectName
    _env: {
      daily: {
        user: {
          trendChartMenuNameList: [
            'Basic', 'Country', 'Platform', 'OS', 'User Access Type'
          ],
          apiList: {
            summary: {
              vertical: ['dau', 'nru', 'dlcnt'],
              horizon: ['mtdau', 'mtdnru']
            },
            userType: ['stu', 'cbu', 'nru'],
            active: ['conncnt', 'conntm']
          },
          glossaryBase: {
            overview: {
              chartName: 'Overview',
              dimension: { ids: [13, 6, 5, 75, 7, 9, 43] },
              kpi: { ids: [63, 44, 45, 46, 65, 66, 18, 25, 26] }
            },
            trend: {
              chartName: 'Daily Trend',
              dimension: { ids: [5, 9, 7, 43] },
              kpi: { ids: [63] }
            },
            platform: {
              chartName: 'Platform',
              dimension: { ids: [9] },
              kpi: { ids: [63] }
            },
            country: {
              chartName: 'Country',
              dimension: { ids: [5, 6] },
              kpi: { ids: [63] }
            },
            os: {
              chartName: 'OS',
              dimension: { ids: [7] }, // OS
              kpi: { ids: [63] } // DAU, Revenue
            },
            topAppVersion: {
              chartName: 'Top App Version',
              dimension: { ids: [13] }, // App Version
              kpi: { ids: [63] } // DAU, Revenue
            },
            userTypePercent: {
              chartName: 'User Access Type (%)',
              dimension: { ids: [43] }, // User Access Type
              kpi: { ids: [46, 45, 44] } // STU, CBU, NRU
            },
            userTypeBasic: {
              chartName: 'User Access Type',
              dimension: { ids: [43] },
              kpi: { ids: [46, 45, 44] }
            },
            totalAccess: {
              kpi: { ids: [25, 26] } // Total Access Count, Total Access Time
            },
            activeCount: {
              chartName: 'Access Count Details',
              dimension: { ids: [43] },
              kpi: { ids: [22] } // DAU, STU, CBU, NRU
            },
            activeTime: {
              chartName: 'Access Time Details',
              dimension: { ids: [43] },
              kpi: { ids: [24] } // DAU, STU, CBU, NRU
            },
            retentionRate: {
              chartName: 'Retention (%)',
              dimension: { ids: [75] }, // Days Elapsed
              kpi: { ids: [71, 73, 72] } // STU, CBU, NRU
            }
          },
          moreDetail: {
            'platform': 72, // Platform
            'country': 72, // Country
            'os': 72, // OS
            'topAppVersion': 46, // Top App Version
            'userTypePercent': 72, // User Type (%)
            'activeTime': 72, // Active Time per User Type
            'retentionRate': 35 // Retention Rate (%)
          },
          downloadReport: `_startDate_&_endDate_&&_dashboardId_&false&00&_projectId_&U_D_EXCEL&BASIC|
          _startDate_&_endDate_&&_dashboardId_&false&03_04&_projectId_&U_D_EXCEL&OS|
          _startDate_&_endDate_&&_dashboardId_&false&03_02&_projectId_&U_D_EXCEL&Country|
          _startDate_&_endDate_&&_dashboardId_&false&03_03&_projectId_&U_D_EXCEL&PLATFORM|
          _startDate_&_endDate_&&_dashboardId_&false&07&_projectId_&U_D_EXCEL&APP_Version`
        },
        userAndRevenue: {
          trendChartMenuNameList: [
            'Basic', 'Country', 'Platform', 'OS', 'User Access Type', 'User Purchase Type'
          ],
          apiList: {
            summary: {
              vertical: ['dau', 'nru', 'sale', 'pu'],
              horizon: ['mtdau', 'mtdsale']
            },
            userType: ['stu', 'cbu', 'nru'],
            active: ['conncnt', 'conntm'],
            revenue: ['arpau', 'arppu', 'pur'],
            payingUserDetails: ['npupur', 'rpupur', 'npuarppu', 'rpuarppu']
          },
          glossaryBase: {
            overview: {
              chartName: 'Overview',
              dimension: { ids: [13, 6, 5, 75, 7, 9, 16, 43, 51] },
              kpi: { ids: [63, 44, 45, 46, 65, 31, 79, 29, 35, 37, 36, 192, 81, 193, 82, 25, 26] }
            },
            summary: {
              kpi: {
                dau: { name: 'DAU', glossaryId: 63 },
                mau: { name: 'MAU', glossaryId: 107 },
                nru: { name: 'NRU', glossaryId: 44 },
                dlcnt: { name: 'First Open Count', glossaryId: 18 },
                sale: { name: 'Revenue', glossaryId: 31 },
                pu: { name: 'PU', glossaryId: 29 },
                mtdau: { name: 'MTD Access User', glossaryId: 65 },
                mtdnru: { name: 'MTD NRU', glossaryId: 66 },
                mtdsale: { name: 'MTD Revenue', glossaryId: 79 },
                totau: { name: 'Total User', glossaryId: 20 },
                totsale: { name: 'Total Revenue', glossaryId: 32 },
                totdlcnt: { name: 'Total First Open Count', glossaryId: 194 }
              }
            },
            trend: {
              chartName: 'Daily Trend',
              dimension: {
                ids: [5, 9, 7, 43, 51],
                country: { name: 'Country', glossaryId: 5 },
                platform: { name: 'Platform', glossaryId: 9 },
                os: { name: 'OS', glossaryId: 7 },
                userAccessType: { name: 'User Access Type', glossaryId: 43 },
                userPurchaseType: { name: 'User Access Type', glossaryId: 51 }
              },
              kpi: {
                ids: [63, 31],
                dau: { name: 'DAU', glossaryId: 63 },
                revenue: { name: 'Revenue', glossaryId: 31 }
              }
            },
            platform: {
              chartName: 'Platform',
              dimension: {
                ids: [9],
                platform: { name: 'Platform', glossaryId: 9 }
              },
              kpi: {
                ids: [63, 31],
                dau: { name: 'DAU', glossaryId: 63 },
                revenue: { name: 'Revenue', glossaryId: 31 }
              }
            },
            country: {
              chartName: 'Country',
              dimension: {
                ids: [5, 6],
                majorCountry: { name: 'MajorCountry', glossaryId: 5 },
                country: { name: 'Country', glossaryId: 6 }
              },
              kpi: {
                ids: [63, 31],
                dau: { name: 'DAU', glossaryId: 63 },
                revenue: { name: 'Revenue', glossaryId: 31 }
              }
            },
            os: {
              chartName: 'OS',
              dimension: { ids: [7] }, // OS
              kpi: { ids: [63, 31] } // DAU, Revenue
            },
            topAppVersion: {
              chartName: 'Top App Version',
              dimension: { ids: [13] }, // App Version
              kpi: { ids: [63, 31] } // DAU, Revenue
            },
            userTypePercent: {
              chartName: 'User Access Type (%)',
              dimension: { ids: [43] }, // User Access Type
              kpi: { ids: [46, 45, 44] } // STU, CBU, NRU
            },
            userTypeBasic: {
              chartName: 'User Access Type',
              dimension: {
                ids: [43],
                userAccessType: { name: 'User Accees Type', glossaryId: 43 }
              },
              kpi: {
                ids: [46, 45, 44],
                stu: { name: 'STU', glossaryId: 46 },
                cbu: { name: 'CBU', glossaryId: 45 },
                nru: { name: 'NRU', glossaryId: 44 }
              }
            },
            totalAccess: {
              kpi: {
                conncnt: { name: 'Total Access Count', glossaryId: 25 },
                conntm: { name: 'Total Access Time', glossaryId: 26 }
              }
            },
            activeCount: {
              chartName: 'Access Count Details',
              dimension: { ids: [43] },
              kpi: { ids: [22] } // DAU, STU, CBU, NRU
            },
            activeTime: {
              chartName: 'Access Time Details',
              dimension: { ids: [43] },
              kpi: { ids: [24] } // DAU, STU, CBU, NRU
            },
            retentionRate: {
              chartName: 'Retention (%)',
              dimension: { ids: [75] }, // Days Elapsed
              kpi: { ids: [71, 73, 72] } // STU, CBU, NRU
            },
            revenueKpi: {
              chartName: 'Revenue KPI',
              dimension: { ids: [] },
              kpi: {
                ids: [37, 36, 35],
                arpau: { name: 'ARPAU', glossaryId: 37 },
                arppu: { name: 'ARPPU', glossaryId: 36 },
                pur: { name: 'PUR', glossaryId: 35 }
              }
            },
            payingUser: {
              chartName: 'Paying User',
              dimension: { ids: [51] }, // User Purchase Type
              kpi: {
                ids: [29, 31] // PU, Revenue
              }
            },
            productTopTen: {
              chartName: 'Product Top 10',
              dimension: { ids: [51, 16] }, // User Purchase Type
              kpi: {
                ids: [29, 31] // PU, Revenue
              }
            },
            payingUserDetails: {
              chartName: 'Paying User Details',
              dimension: { ids: [] },
              kpi: {
                ids: [81, 82, 192, 193],
                npupur: { name: 'NPU PUR', glossaryId: 81 },
                rpupur: { name: 'RPU PUR', glossaryId: 82 },
                npuarppu: { name: 'NPU ARPPU', glossaryId: 192 },
                rpuarppu: { name: 'RPU ARPPU', glossaryId: 193 }
              }
            }
          },
          moreDetail: {
            'platform': 7, // Platform
            'country': 7, // Country
            'os': 7, // OS
            'topAppVersion': 46, // Top App Version
            'userTypePercent': 7, // User Type (%)
            'activeTime': 7, // Active Time per User Type
            'retentionRate': 35, // Retention Rate (%)
            'payingUser': 16, // Paying User
            'productTopTen': 51 // Product Top 10
          },
          downloadReport: `_startDate_&_endDate_&_currency_&_dashboardId_&true&00&_projectId_&UR_D_EXCEL&BASIC|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&03_04&_projectId_&UR_D_EXCEL&OS|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&03_02&_projectId_&UR_D_EXCEL&Country|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&03_03&_projectId_&UR_D_EXCEL&PLATFORM|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&07&_projectId_&UR_D_EXCEL&APP_Version|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&12&_projectId_&UR_D_EXCEL&Product_Top_10`
        }
      },
      monthly: {
        user: {
          trendChartMenuNameList: [
            'Basic', 'Country', 'Platform', 'OS', 'User Access Type'
          ],
          apiList: {
            summary: {
              vertical: ['mau', 'nru', 'dlcnt'],
              horizon: ['totau', 'totdlcnt']
            },
            userType: ['stu', 'cbu', 'nru'],
            active: ['conncnt', 'conntm']
          },
          glossaryBase: {
            overview: {
              chartName: 'Overview',
              dimension: { ids: [13, 6, 5, 7, 9, 91] },
              kpi: { ids: [107, 92, 93, 94, 20, 18, 194, 25, 26] }
            },
            trend: {
              chartName: 'Monthly Trend',
              dimension: { ids: [5, 9, 7, 91] },
              kpi: { ids: [107] }
            },
            platform: {
              chartName: 'Platform',
              dimension: { ids: [9] },
              kpi: { ids: [107] }
            },
            country: {
              chartName: 'Country',
              dimension: { ids: [5, 6] },
              kpi: { ids: [107] }
            },
            os: {
              chartName: 'OS',
              dimension: { ids: [7] }, // OS
              kpi: { ids: [107] } // DAU, Revenue
            },
            topAppVersion: {
              chartName: 'Top App Version',
              dimension: { ids: [13] }, // App Version
              kpi: { ids: [107] } // DAU, Revenue
            },
            userTypePercent: {
              chartName: 'User Access Type (%)',
              dimension: { ids: [91] }, // User Access Type
              kpi: { ids: [94, 93, 92] } // STU, CBU, NRU
            },
            userTypeBasic: {
              chartName: 'User Access Type',
              dimension: { ids: [91] }, // User Access Type
              kpi: { ids: [94, 93, 92] } // STU, CBU, NRU
            },
            totalAccess: {
              kpi: {
                conncnt: { name: 'Total Access Count', glossaryId: 25 },
                conntm: { name: 'Total Access Time', glossaryId: 26 }
              }
            },
            activeCount: {
              chartName: 'Access Count Details',
              dimension: { ids: [91] },
              kpi: { ids: [22] } //  MAU, STU, CBU, NRU
            },
            activeTime: {
              chartName: 'Access Time Details',
              dimension: { ids: [91] },
              kpi: { ids: [24] } // MAU, STU, CBU, NRU
            }

          },
          moreDetail: {
            'platform': 73, // Platform
            'country': 73, // Country
            'os': 73, // OS
            'topAppVersion': 4, // Top App Version
            'userTypePercent': 73, // User Type (%)
            'activeTime': 73 // Active Time per User Type
          },
          downloadReport: `_startDate_&_endDate_&&_dashboardId_&false&00&_projectId_&U_M_EXCEL&BASIC|
          _startDate_&_endDate_&&_dashboardId_&false&03_04&_projectId_&U_M_EXCEL&OS|
          _startDate_&_endDate_&&_dashboardId_&false&03_02&_projectId_&U_M_EXCEL&Country|
          _startDate_&_endDate_&&_dashboardId_&false&03_03&_projectId_&U_M_EXCEL&PLATFORM|
          _startDate_&_endDate_&&_dashboardId_&false&07&_projectId_&U_M_EXCEL&APP_Version`
        },
        userAndRevenue: {
          trendChartMenuNameList: [
            'Basic', 'Country', 'Platform', 'OS', 'User Access Type', 'User Purchase Type'
          ],
          apiList: {
            summary: {
              vertical: ['mau', 'nru', 'sale', 'pu'],
              horizon: ['totau', 'totsale']
            },
            userType: ['stu', 'cbu', 'nru'],
            active: ['conncnt', 'conntm'],
            revenue: ['arpau', 'arppu', 'pur']
          },
          glossaryBase: {
            overview: {
              chartName: 'Overview',
              dimension: { ids: [13, 6, 5, 7, 9, 16, 91, 96] },
              kpi: { ids: [107, 92, 93, 94, 20, 31, 32, 29, 35, 37, 36, 25, 26] }
            },
            trend: {
              chartName: 'Monthly Trend',
              dimension: { ids: [5, 9, 7, 91, 96] },
              kpi: { ids: [107, 31] }
            },
            platform: {
              chartName: 'Platform',
              dimension: { ids: [9] },
              kpi: { ids: [107, 31] }
            },
            country: {
              chartName: 'Country',
              dimension: { ids: [5, 6] },
              kpi: { ids: [107, 31] }
            },
            os: {
              chartName: 'OS',
              dimension: { ids: [7] }, // OS
              kpi: { ids: [107, 31] } // DAU, Revenue
            },
            topAppVersion: {
              chartName: 'Top App Version',
              dimension: { ids: [13] }, // App Version
              kpi: { ids: [107, 31] } // DAU, Revenue
            },
            userTypePercent: {
              chartName: 'User Access Type (%)',
              dimension: { ids: [91] }, // User Access Type
              kpi: { ids: [94, 93, 92] } // STU, CBU, NRU
            },
            userTypeBasic: {
              chartName: 'User Access Type',
              dimension: { ids: [91] }, // User Access Type
              kpi: { ids: [94, 93, 92] } // STU, CBU, NRU
            },
            totalAccess: {
              kpi: {
                conncnt: { name: 'Total Access Count', glossaryId: 25 },
                conntm: { name: 'Total Access Time', glossaryId: 26 }
              }
            },
            revenueKpi: {
              chartName: 'Revenue KPI',
              dimension: { ids: [] },
              kpi: { ids: [37, 36, 35] }
            },
            payingUser: {
              chartName: 'Paying User',
              dimension: { ids: [96] }, // User Purchase Type
              kpi: { ids: [29, 31] } // PU, Revenue
            },
            productTopTen: {
              chartName: 'Product Top 10',
              dimension: { ids: [96, 16] }, // User Purchase Type, Product Name
              kpi: {
                ids: [29, 31] // PU, Revenue
              }
            }
          },
          moreDetail: {
            'platform': 3, // Platform
            'country': 3, // Country
            'os': 3, // OS
            'topAppVersion': 4, // Top App Version
            'userTypePercent': 3, // User Type (%)
            'activeTime': 3, // Active Time per User Type
            'payingUser': 31, // Paying User
            'productTopTen': 54 // Product Top 10
          },
          downloadReport: `_startDate_&_endDate_&_currency_&_dashboardId_&true&00&_projectId_&UR_M_EXCEL&BASIC|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&03_04&_projectId_&UR_M_EXCEL&OS|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&03_02&_projectId_&UR_M_EXCEL&Country|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&03_03&_projectId_&UR_M_EXCEL&PLATFORM|
          _startDate_&_endDate_&_currency_&_dashboardId_&true&07&_projectId_&UR_M_EXCEL&APP_Version`
        }
      }
    },
    _nickNames: {
      DAU: 'DAU',
      MAU: 'MAU',
      NRU: 'NRU',
      PU: 'PU',
      DLCNT: 'First Open Count',
      REVENUE: 'Revenue',
      SALE: 'Revenue',
      MTDAU: 'MTD Access User',
      MTDACCESSUSER: 'Mtd Access User',
      MTDSALE: 'MTD Revenue',
      MTDREVENUE: 'MTD Revenue',
      MTDNRU: 'MTD NRU',
      TOTAU: 'Total User',
      TOTDLCNT: 'Total First<br/>Open Count',
      TOTSALE: 'Total Revenue',
      STU: 'STU',
      CBU: 'CBU',
      CONNCNT: 'Total Access Count',
      CONNTM: 'Total Access Time',
      NPUPUR: 'NPU Rate',
      RPUPUR: 'RPU Rate',
      NPUARPPU: 'NPU ARPPU',
      RPUARPPU: 'RPU ARPPU',
      ARPAU: 'ARPAU',
      ARPPU: 'ARPPU',
      PUR: 'PUR'
    },
    // CHART DATA
    _numberTypeData: {
      summary: {
        vertical: {
          dau: {},
          mau: {},
          dlcnt: {},
          nru: {},
          pu: {},
          sale: {}
        },
        horizon: {
          mtdau: {},
          mtdsale: {},
          totau: {},
          totsale: {},
          totdlcnt: {}
        }
      },
      active: {
        total: {
          conncnt: {},
          conntm: {}
        }
      },
      revenue: {
        arpau: {},
        arppu: {},
        pur: {}
      },
      payingUserDetails: {
        details: {
          npupur: {},
          rpupur: {},
          rpuarppu: {},
          npuarppu: {}
        }
      },
      userType: {
        stu: {},
        cbu: {},
        nru: {},
        arpau: {},
        arppu: {},
        pur: {}
      }
    },
    // _chartTypeData: {
    //   trendChartData: {
    //     Basic: {},
    //     Country: {},
    //     OS: {},
    //     Platform: {},
    //     Gender: {},
    //     Age: {},
    //     'User Type': {}
    //   },
    //   treemapData: [
    //     {
    //       id: 'A',
    //       name: '',
    //       color: '#6fc765'
    //     }, {
    //       id: 'B',
    //       name: '',
    //       color: '#52afff'
    //     }, {
    //       id: 'C',
    //       name: '',
    //       color: '#be62e7'
    //     },
    //     {
    //       id: 'D',
    //       name: '',
    //       color: '#f093b4'
    //     }, {
    //       name: 'A',
    //       parent: 'A',
    //       value: 50
    //     }, {
    //       name: 'B',
    //       parent: 'B',
    //       value: 30
    //     }, {
    //       name: 'C',
    //       parent: 'C',
    //       value: 10
    //     }, {
    //       name: 'D',
    //       parent: 'D',
    //       value: 6
    //     },
    //     {
    //       name: 'E',
    //       parent: 'D',
    //       value: 5,
    //       color: '#faa466'
    //     },
    //     {
    //       name: 'F',
    //       parent: 'D',
    //       value: 4,
    //       color: '#a8da6a'
    //     },
    //     {
    //       name: 'G',
    //       parent: 'D',
    //       value: 3,
    //       color: '#76d8e5'
    //     },
    //     {
    //       name: 'H',
    //       parent: 'D',
    //       value: 2,
    //       color: '#f46c7c'
    //     },
    //     {
    //       name: 'I',
    //       parent: 'D',
    //       value: 1,
    //       color: '#cd9059'
    //     },
    //     {
    //       name: 'J',
    //       parent: 'D',
    //       value: 1,
    //       color: '#fcc949'
    //     }]
    // },
    _worldmapTypeData: {
      country: {
        dau: [],
        sales: []
      },
      // 한 줄 당 20개국 코드, 총 213개국
      template: [
        'fo', 'um', 'us', 'jp', 'sc', 'in', 'fr', 'fm', 'cn', 'pt', 'sw', 'sh', 'br', 'ki', 'ph', 'mx', 'es', 'bu', 'mv', 'sp',
        'gb', 'gr', 'as', 'dk', 'gl', 'gu', 'mp', 'pr', 'vi', 'ca', 'st', 'cv', 'dm', 'nl', 'jm', 'ws', 'om', 'vc', 'tr', 'bd',
        'lc', 'nr', 'no', 'kn', 'bh', 'to', 'fi', 'id', 'mu', 'se', 'tt', 'my', 'pa', 'pw', 'tv', 'mh', 'cl', 'th', 'gd', 'ee',
        'ag', 'tw', 'bb', 'it', 'mt', 'vu', 'sg', 'cy', 'lk', 'km', 'fj', 'ru', 'va', 'sm', 'kz', 'az', 'tj', 'ls', 'uz', 'ma',
        'co', 'tl', 'tz', 'ar', 'sa', 'pk', 'ye', 'ae', 'ke', 'pe', 'do', 'ht', 'pg', 'ao', 'kh', 'vn', 'mz', 'cr', 'bj', 'ng',
        'ir', 'sv', 'sl', 'gw', 'hr', 'bz', 'za', 'cf', 'sd', 'cd', 'kw', 'de', 'be', 'ie', 'kp', 'kr', 'gy', 'hn', 'mm', 'ga',
        'gq', 'ni', 'lv', 'ug', 'mw', 'am', 'sx', 'tm', 'zm', 'nc', 'mr', 'dz', 'lt', 'et', 'er', 'gh', 'si', 'gt', 'ba', 'jo',
        'sy', 'mc', 'al', 'uy', 'cnm', 'mn', 'rw', 'so', 'bo', 'cm', 'cg', 'eh', 'rs', 'me', 'tg', 'la', 'af', 'ua', 'sk', 'jk',
        'bg', 'qa', 'li', 'at', 'sz', 'hu', 'ro', 'ne', 'lu', 'ad', 'ci', 'lr', 'bn', 'iq', 'ge', 'gm', 'ch', 'td', 'kv', 'lb',
        'dj', 'bi', 'sr', 'il', 'ml', 'sn', 'gn', 'zw', 'pl', 'mk', 'py', 'by', 'cz', 'bf', 'na', 'ly', 'tn', 'bt', 'md', 'ss',
        'bw', 'bs', 'nz', 'cu', 'ec', 'au', 've', 'sb', 'mg', 'is', 'eg', 'kg', 'np']
    }
  },
  mutations: {
    [types.SET_DASHBOARD] (state, payload) {
      if (_.isBoolean(payload.isDaily)) state.isDaily = payload.isDaily
      if (_.isBoolean(payload.hasRevenue)) state.hasRevenue = payload.hasRevenue
    },
    [types.GET_BASIC_INFO_DATA] (state, payload) {
      if (!_.isEmpty(payload.data) && _.isObject(payload.data)) {
        if (_.isArray(payload.data)) {
          payload.data.forEach(item => {
            state._numberTypeData[payload.route][payload.type][_.lowerCase(item.name)] = item
          })
        } else {
          if (!_.isEmpty(payload.data)) {
            state._numberTypeData[payload.route][payload.type] = payload.data
          }
        }
      }
    },
    [types.GET_WORLD_MAP_DATA] (state, payload) {
      if (!_.isEmpty(payload.data) && _.isArray(payload.data) && payload.route && payload.child) {
        state._worldmapTypeData[payload.route][payload.child] = payload.data
      }
    },
    [types.SET_DASHBOARD_CURRENT_DATES] (state, payload) {
      if (!_.isEmpty(payload) && _.isObject(payload)) {
        state._currentDates = payload
      }
    },
    [types.SET_DASHBOARD_STATE] (state, payload) {
      if (_.isArray(payload.stateName)) {
        switch (payload.stateName.length) {
          case 2:
            state[payload.stateName[0]][payload.stateName[1]] = payload.stateValue
            break
          case 3:
            state[payload.stateName[0]][payload.stateName[1]][payload.stateName[2]] = payload.stateValue
            break
          default:
            if (payload.stateName[0]) state[payload.stateName[0]] = payload.stateValue
            break
        }
      } else {
        if (payload.stateName) {
          state[payload.stateName] = payload.stateValue
        }
      }
    }
  },
  actions: {
    async [types.GET_BASIC_INFO_DATA] (context, payload) {
      if (!_.isEmpty(payload.req) && _.isObject(payload.req)) {
        context.state._nowCallApiList.push(payload.req.objectId)
        return new Promise((resolve, reject) => {
          payload.req.serviceType = 'NUMBER'
          http.getPromise(`/dashboard/number/data`, payload.req).then(res => {
            if (_.isEmpty(res.data)) {
              reject()
              // reject(console.log(`%c GET_CHART_DATA > res.data is Empty > req: ${payload.req} `, 'font-weight: bold; font-size: 17px;color: #42a7f4;'))
            } else {
              let chartData = _.cloneDeep(res.data.kpis)
              const chartDataList = res.data.innerChartData.chartDataList

              let chartDataObject = {}
              chartDataList.forEach(item => {
                chartDataObject[item.kpi.kpiName] = { dataList: item.dataList, kpi: item.kpi }
              })
              if (chartDataObject[`${payload.type}_v`]) {
                chartData[0]['innerChartData'] = [{
                  name: chartDataObject[`${payload.type}_v`].kpi.kpiName,
                  data: chartDataObject[`${payload.type}_v`].dataList,
                  lineWidth: 1,
                  marker: { radius: 2 },
                  xAxisList: res.data.innerChartData.xAxisList,
                  currency: payload.currency
                }]
              }
              if (chartData.length === 1) chartData = chartData[0]
              _.pull(context.state._nowCallApiList, payload.req.objectId)
              if (payload.route === '_direct_') {
                resolve({data: chartData, menuName: payload.type})
              } else {
                context.commit(types.GET_BASIC_INFO_DATA, {route: payload.route, type: payload.type, data: chartData})
              }
            }
          }).catch((e) => {
            // console.log 는 추후 삭제
            _.pull(context.state._nowCallApiList, payload.req.objectId)
            reject()
            // reject(console.log('%c GET_BASIC_INFO_DATA - API 호출 실패!', 'font-weight: bold; font-size: 17px;color: #3dcc49;'))
          })
        })
      }
    },
    async [types.GET_CHART_DATA] (context, payload) {
      if (!_.isEmpty(payload.req) && _.isObject(payload.req)) {
        return new Promise((resolve, reject) => {
          context.state._nowCallApiList.push(payload.req.objectId)
          payload.req.serviceType = 'CHART'
          http.getPromise(`/dashboard/chart/data`, payload.req).then(res => {
            if (_.isEmpty(res.data)) {
              reject()
              // reject(console.log(`%c GET_CHART_DATA > res.data is Empty > req: ${payload.req} `, 'font-weight: bold; font-size: 17px;color: #42a7f4;'))
            } else {
              resolve({data: res.data, menuName: payload.route})
            }
            _.pull(context.state._nowCallApiList, payload.req.objectId)
          }).catch((e) => {
            // console.log 는 추후 삭제
            _.pull(context.state._nowCallApiList, payload.req.objectId)
            resolve({})
            reject()
            // reject(console.log('%c GET_CHART_DATA - API 호출 실패!', 'font-weight: bold; font-size: 17px;color: #42a7f4;'))
          })
        })
      }
    },
    [types.GET_WORLD_MAP_DATA] (context, payload) {
      if (!_.isEmpty(payload.req) && _.isObject(payload.req)) {
        return new Promise((resolve, reject) => {
          context.state._nowCallApiList.push(payload.req.objectId)
          payload.req.serviceType = 'WORLDMAP'
          http.getPromise(`/dashboard/worldMap/data`, payload.req).then(res => {
            if (_.isEmpty(res.data)) {
              reject()
              // reject(console.log(`%c GET_CHART_DATA > res.data is Empty > req: ${payload.req} `, 'font-weight: bold; font-size: 17px;color: #42a7f4;'))
            } else {
              resolve({data: res.data, menuName: payload.route})
            }
            _.pull(context.state._nowCallApiList, payload.req.objectId)
          }).catch((e) => {
            // console.log 는 추후 삭제
            _.pull(context.state._nowCallApiList, payload.req.objectId)
            resolve({})
            reject()
            // reject(console.log('%c GET_WORLD_MAP_DATA - API 호출 실패!', 'font-weight: bold; font-size: 17px;color: #bf740b;'))
          })
        })
      }
    },
    [types.GET_REALTIME_LIVE_DATA] (context, payload) {
      if (!_.isEmpty(payload.req) && _.isObject(payload.req)) {
        return new Promise((resolve, reject) => {
          // context.state._nowCallApiList.push(payload.req.objectId)
          // payload.req.serviceType = ''
          http.putPromise(`/dashboard/realtime/chart/data`, payload.req).then(res => {
            if (_.isEmpty(res.data)) {
              reject(console.log(`%c GET_REALTIME_LIVE_DATA > res.data is Empty > req: ${payload.req} `, 'font-weight: bold; font-size: 17px;color: #42a7f4;'))
            } else {
              resolve({data: res.data, menuName: payload.route})
            }
            // _.pull(context.state._nowCallApiList, payload.req.objectId)
          }).catch((e) => {
            // console.log 는 추후 삭제
            // _.pull(context.state._nowCallApiList, payload.req.objectId)
            resolve({})
            reject()
            // reject(console.log('%c GET_REALTIME_LIVE_DATA - API 호출 실패!', 'font-weight: bold; font-size: 17px;color: #bf740b;'))
          })
        })
      }
    },
    [types.GET_REALTIME_TABLE_DATA] (context, payload) {
      if (!_.isEmpty(payload.req) && _.isObject(payload.req)) {
        return new Promise((resolve, reject) => {
          // context.state._nowCallApiList.push(payload.req.objectId)
          // payload.req.serviceType = ''
          http.putPromise(`/dashboard/realtime/table/data`, payload.req).then(res => {
            if (_.isEmpty(res.data)) {
              reject()
              // reject(console.log(`%c GET_REALTIME_HOURLY_DATA > res.data is Empty > req: ${payload.req} `, 'font-weight: bold; font-size: 17px;color: #42a7f4;'))
            } else {
              resolve({data: res.data, menuName: payload.route})
            }
            // _.pull(context.state._nowCallApiList, payload.req.objectId)
          }).catch((e) => {
            // console.log 는 추후 삭제
            // _.pull(context.state._nowCallApiList, payload.req.objectId)
            reject()
            // reject(console.log('%c GET_REALTIME_HOURLY_DATA - API 호출 실패!', 'font-weight: bold; font-size: 17px;color: #bf740b;'))
          })
        })
      }
    },
    [types.GET_DOWNLOAD_REPORT] (context, payload) {
      const host = window.location.href.indexOf('analytics.growthy.game.line.me') > -1
                  ? 'https://growthy-agw.game.line.me'
                  : 'http://growthy-agw-dev.game.line-alpha.me:8009'
      const url = `${host}/v1/dashboard/export/excel?searchDataParam=${payload.queryString}`
      // console.log(`url: ${url}`)
      window.open(url)
    },
    [types.GET_REALTIME_PROJECT_INFO] (context, payload) {
      return new Promise((resolve, reject) => {
        http.putPromise(`/dashboard/realtime/param/data?projectId=${payload.projectId}&realTimeDataParam=${payload.realTimeDataParam}`).then(res => {
          resolve(res.data)
        })
      })
    },
    [types.GET_REALTIME_OBJECT_IDS] (context, payload) {
      return new Promise((resolve, reject) => {
        http.getPromise(`/report/layout/${payload.menuId}/${payload.depth}/project/${payload.projectId}`).then(res => {
          resolve(res.data)
        })
      })
    },
    [types.GET_DASHBOARD_GROSSARY_INFO] (context, payload) {
      return new Promise((resolve, reject) => {
        http.getPromise(`/board/glossary/list/ids?${payload.ids}`).then(res => {
          resolve(res.data)
        })
      })
    }
  }
}
