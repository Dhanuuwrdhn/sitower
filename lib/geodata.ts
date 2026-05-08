// AUTO-GENERATED dari KML Jalur Transmisi UPT Durikosambi
// Total: 39 Gardu Induk, 431 Tower SUTET 500kV, 607 Tower SUTT 150kV, 339 Tower SKTT, 52 Jalur

export interface GeoPoint {
  lat: number
  lng: number
}

export interface GarduInduk {
  name: string
  lat: number
  lng: number
  style?: string
  type: 'gardu'
}

export interface TowerPoint {
  name: string
  lat: number
  lng: number
  style?: string
  type: 'SUTET_500kV' | 'SUTT_150kV' | 'SKTT_150kV'
}

export interface JalurTransmisi {
  name: string
  type: 'SUTET_500kV' | 'SUTT_150kV' | 'SKTT_150kV' | 'other'
  color: string
  path: GeoPoint[]
}

// Warna per tipe jalur
export const JALUR_COLORS = {
  SUTET_500kV: '#e65100',  // oranye gelap
  SUTT_150kV:  '#0288d1',  // biru
  SKTT_150kV:  '#7c3aed',  // ungu
  other:       '#94a3b8',  // abu
}

// 39 Gardu Induk
export const garduInduk: GarduInduk[] = [
  {
    "name": "GI Teluk Naga",
    "style": "#icon-1548-000000",
    "lng": 106.636328,
    "lat": -6.064451,
    "type": "gardu"
  },
  {
    "name": "Pasar Kemis (UPT Cikupa)",
    "style": "#icon-1548-000000",
    "lng": 106.529727,
    "lat": -6.18315,
    "type": "gardu"
  },
  {
    "name": "GIS Lontar",
    "style": "#icon-1548-000000",
    "lng": 106.463862,
    "lat": -6.060055,
    "type": "gardu"
  },
  {
    "name": "Pasar Kemis Baru (UPT Cikupa)",
    "style": "#icon-1548-000000",
    "lng": 106.5600025,
    "lat": -6.1423514,
    "type": "gardu"
  },
  {
    "name": "GISTET Kembangan",
    "style": "#icon-1548-000000",
    "lng": 106.719739,
    "lat": -6.188128,
    "type": "gardu"
  },
  {
    "name": "GI Angke",
    "style": "#icon-1548-000000",
    "lng": 106.791144,
    "lat": -6.134313,
    "type": "gardu"
  },
  {
    "name": "GI Durikosambi",
    "style": "#icon-1548-000000",
    "lng": 106.725938,
    "lat": -6.170969,
    "type": "gardu"
  },
  {
    "name": "GIS Grogol",
    "style": "#icon-1548-000000",
    "lng": 106.783709,
    "lat": -6.166449,
    "type": "gardu"
  },
  {
    "name": "GIS Kebon Jeruk",
    "style": "#icon-1548-000000",
    "lng": 106.781952,
    "lat": -6.190578,
    "type": "gardu"
  },
  {
    "name": "GIS Kembangan",
    "style": "#icon-1548-000000",
    "lng": 106.719739,
    "lat": -6.188128,
    "type": "gardu"
  },
  {
    "name": "GI Muarakarang Baru",
    "style": "#icon-1548-000000",
    "lng": 106.781579,
    "lat": -6.109815,
    "type": "gardu"
  },
  {
    "name": "GIS New Senayan",
    "style": "#icon-1548-000000",
    "lng": 106.771707,
    "lat": -6.227583,
    "type": "gardu"
  },
  {
    "name": "GI Muarakarang Lama",
    "style": "#icon-1548-000000",
    "lng": 106.7868,
    "lat": -6.11142,
    "type": "gardu"
  },
  {
    "name": "GIS Pantai Indah Kapuk",
    "style": "#icon-1548-000000",
    "lng": 106.751088,
    "lat": -6.12383,
    "type": "gardu"
  },
  {
    "name": "GIS Daan Mogot",
    "style": "#icon-1548-000000",
    "lng": 106.739139,
    "lat": -6.150516,
    "type": "gardu"
  },
  {
    "name": "GI Jatake",
    "style": "#icon-1548-000000",
    "lng": 106.583157,
    "lat": -6.214297,
    "type": "gardu"
  },
  {
    "name": "GI Maximangando",
    "style": "#icon-1548-000000",
    "lng": 106.588769,
    "lat": -6.211318,
    "type": "gardu"
  },
  {
    "name": "GI Curug",
    "style": "#icon-1548-000000",
    "lng": 106.609061,
    "lat": -6.242565,
    "type": "gardu"
  },
  {
    "name": "GI Tangerang Baru",
    "style": "#icon-1548-000000",
    "lng": 106.606202,
    "lat": -6.156176,
    "type": "gardu"
  },
  {
    "name": "GI Cengkareng",
    "style": "#icon-1548-000000",
    "lng": 106.659203,
    "lat": -6.150885,
    "type": "gardu"
  },
  {
    "name": "GI Ciledug",
    "style": "#icon-1548-000000",
    "lng": 106.680257,
    "lat": -6.211287,
    "type": "gardu"
  },
  {
    "name": "GI Tangerang Lama",
    "style": "#icon-1548-000000",
    "lng": 106.641036,
    "lat": -6.206991,
    "type": "gardu"
  },
  {
    "name": "GIS Alam Sutera",
    "style": "#icon-1548-000000",
    "lng": 106.6564,
    "lat": -6.2201907,
    "type": "gardu"
  },
  {
    "name": "GI Cengkareng Baru",
    "style": "#icon-1548-000000",
    "lng": 106.6588676,
    "lat": -6.1497712,
    "type": "gardu"
  },
  {
    "name": "Petukangan (UPT Gandul)",
    "style": "#icon-1548-000000",
    "lng": 106.7433022,
    "lat": -6.2528873,
    "type": "gardu"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1548-000000",
    "lng": 106.5548475,
    "lat": -6.1825037,
    "type": "gardu"
  },
  {
    "name": "GISTET Durikosambi",
    "style": "#icon-1548-000000",
    "lng": 106.7245195,
    "lat": -6.1726893,
    "type": "gardu"
  },
  {
    "name": "GIS Grogol Baru",
    "style": "#icon-1548-000000",
    "lng": 106.7669607,
    "lat": -6.1634634,
    "type": "gardu"
  },
  {
    "name": "GIS Summarecon Gading Serpong",
    "style": "#icon-1548-000000",
    "lng": 106.6433661,
    "lat": -6.2433162,
    "type": "gardu"
  },
  {
    "name": "GI Sindang Jaya",
    "style": "#icon-1548-000000",
    "lng": 106.4831675,
    "lat": -6.1479719,
    "type": "gardu"
  },
  {
    "name": "GIS Jatake Baru",
    "style": "#icon-1548-000000",
    "lng": 106.5942003,
    "lat": -6.2202855,
    "type": "gardu"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1548-000000",
    "lng": 106.7631123,
    "lat": -6.2452821,
    "type": "gardu"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1548-000000",
    "lng": 106.6259415,
    "lat": -6.1613831,
    "type": "gardu"
  },
  {
    "name": "GIS Tomang",
    "style": "#icon-1548-000000",
    "lng": 106.775401,
    "lat": -6.18738,
    "type": "gardu"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1548-000000",
    "lng": 106.7808477,
    "lat": -6.1093789,
    "type": "gardu"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1548-000000",
    "lng": 106.7105339,
    "lat": -6.1978907,
    "type": "gardu"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1548-000000",
    "lng": 106.6776818,
    "lat": -6.0601215,
    "type": "gardu"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1548-000000",
    "lng": 106.78767,
    "lat": -6.3469217,
    "type": "gardu"
  },
  {
    "name": "GISTET MUARAKARANG",
    "style": "#icon-1548-000000",
    "lng": 106.781497,
    "lat": -6.1105958,
    "type": "gardu"
  }
];

// 431 Tower SUTET
export const towerSUTET: TowerPoint[] = [
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #L01",
    "style": "#icon-1899-0288D1",
    "lng": 106.098318,
    "lat": -5.99029,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #L02",
    "style": "#icon-1899-0288D1",
    "lng": 106.097195,
    "lat": -5.990828,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #L03",
    "style": "#icon-1899-0288D1",
    "lng": 106.094551,
    "lat": -5.993304,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #L04",
    "style": "#icon-1899-0288D1",
    "lng": 106.095541,
    "lat": -5.997127,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.09847,
    "lat": -6.00277,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH02",
    "style": "#icon-1899-0288D1",
    "lng": 106.09857,
    "lat": -5.99923,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D3",
    "style": "#icon-1899-0288D1",
    "lng": 106.0984,
    "lat": -6.00647,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D4",
    "style": "#icon-1899-0288D1",
    "lng": 106.09828,
    "lat": -6.01061,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A5",
    "style": "#icon-1899-0288D1",
    "lng": 106.09806,
    "lat": -6.01349,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D6",
    "style": "#icon-1899-0288D1",
    "lng": 106.0974,
    "lat": -6.0162,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.09699,
    "lat": -6.01795,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH7",
    "style": "#icon-1899-0288D1",
    "lng": 106.09619,
    "lat": -6.020819,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D8",
    "style": "#icon-1899-0288D1",
    "lng": 106.09833,
    "lat": -6.02337,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D9 (Sudah dibongkar, pindah tempat menjadi tower AH9A",
    "style": "#icon-1899-0288D1",
    "lng": 106.101674,
    "lat": -6.026557,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH10",
    "style": "#icon-1899-0288D1",
    "lng": 106.10419,
    "lat": -6.02806,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH11",
    "style": "#icon-1899-0288D1",
    "lng": 106.103858,
    "lat": -6.030824,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D12",
    "style": "#icon-1899-0288D1",
    "lng": 106.10666,
    "lat": -6.03366,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.10909,
    "lat": -6.03641,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D14",
    "style": "#icon-1899-0288D1",
    "lng": 106.111816,
    "lat": -6.03931,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.11441,
    "lat": -6.04232,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D16",
    "style": "#icon-1899-0288D1",
    "lng": 106.11707,
    "lat": -6.04523,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D17",
    "style": "#icon-1899-0288D1",
    "lng": 106.11975,
    "lat": -6.04813,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D18",
    "style": "#icon-1899-0288D1",
    "lng": 106.1224,
    "lat": -6.05095,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D19",
    "style": "#icon-1899-0288D1",
    "lng": 106.124715,
    "lat": -6.053725,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D20",
    "style": "#icon-1899-0288D1",
    "lng": 106.12726,
    "lat": -6.0562,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D21",
    "style": "#icon-1899-0288D1",
    "lng": 106.13013,
    "lat": -6.05944,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH22",
    "style": "#icon-1899-0288D1",
    "lng": 106.13175,
    "lat": -6.06144,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D23",
    "style": "#icon-1899-0288D1",
    "lng": 106.13558,
    "lat": -6.06167,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D24",
    "style": "#icon-1899-0288D1",
    "lng": 106.13869,
    "lat": -6.06199,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D25",
    "style": "#icon-1899-0288D1",
    "lng": 106.14267,
    "lat": -6.06235,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH26",
    "style": "#icon-1899-0288D1",
    "lng": 106.144815,
    "lat": -6.062789,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH27",
    "style": "#icon-1899-0288D1",
    "lng": 106.14723,
    "lat": -6.06589,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH28",
    "style": "#icon-1899-0288D1",
    "lng": 106.1508,
    "lat": -6.06731,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH29",
    "style": "#icon-1899-0288D1",
    "lng": 106.153922,
    "lat": -6.06669,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH30",
    "style": "#icon-1899-0288D1",
    "lng": 106.155549,
    "lat": -6.064474,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH31",
    "style": "#icon-1899-0288D1",
    "lng": 106.15872,
    "lat": -6.06341,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A32",
    "style": "#icon-1899-0288D1",
    "lng": 106.16288,
    "lat": -6.06513,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D33",
    "style": "#icon-1899-0288D1",
    "lng": 106.165936,
    "lat": -6.067027,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A34",
    "style": "#icon-1899-0288D1",
    "lng": 106.168395,
    "lat": -6.068451,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D35",
    "style": "#icon-1899-0288D1",
    "lng": 106.17277,
    "lat": -6.07027,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D36",
    "style": "#icon-1899-0288D1",
    "lng": 106.17538,
    "lat": -6.07147,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D37",
    "style": "#icon-1899-0288D1",
    "lng": 106.17804,
    "lat": -6.07265,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D38",
    "style": "#icon-1899-0288D1",
    "lng": 106.18092,
    "lat": -6.074,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A39",
    "style": "#icon-1899-0288D1",
    "lng": 106.183668,
    "lat": -6.07542,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D40",
    "style": "#icon-1899-0288D1",
    "lng": 106.18641,
    "lat": -6.07811,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D41",
    "style": "#icon-1899-0288D1",
    "lng": 106.18908,
    "lat": -6.08104,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D42",
    "style": "#icon-1899-0288D1",
    "lng": 106.19158,
    "lat": -6.08395,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D43",
    "style": "#icon-1899-0288D1",
    "lng": 106.19386,
    "lat": -6.08656,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D44",
    "style": "#icon-1899-0288D1",
    "lng": 106.19609,
    "lat": -6.08903,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D45",
    "style": "#icon-1899-0288D1",
    "lng": 106.19829,
    "lat": -6.0916,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH46",
    "style": "#icon-1899-0288D1",
    "lng": 106.200395,
    "lat": -6.094222,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A47",
    "style": "#icon-1899-0288D1",
    "lng": 106.203751,
    "lat": -6.09548,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A48",
    "style": "#icon-1899-0288D1",
    "lng": 106.205818,
    "lat": -6.097794,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A49",
    "style": "#icon-1899-0288D1",
    "lng": 106.207872,
    "lat": -6.09974,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D50",
    "style": "#icon-1899-0288D1",
    "lng": 106.210966,
    "lat": -6.100998,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D51",
    "style": "#icon-1899-0288D1",
    "lng": 106.21412,
    "lat": -6.10263,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D52",
    "style": "#icon-1899-0288D1",
    "lng": 106.21757,
    "lat": -6.1039,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D53",
    "style": "#icon-1899-0288D1",
    "lng": 106.22043,
    "lat": -6.10524,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A54",
    "style": "#icon-1899-0288D1",
    "lng": 106.223293,
    "lat": -6.106603,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A55",
    "style": "#icon-1899-0288D1",
    "lng": 106.22803,
    "lat": -6.10764,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A56",
    "style": "#icon-1899-0288D1",
    "lng": 106.23095,
    "lat": -6.10855,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D57",
    "style": "#icon-1899-0288D1",
    "lng": 106.23453,
    "lat": -6.11055,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A58",
    "style": "#icon-1899-0288D1",
    "lng": 106.237445,
    "lat": -6.112101,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A59",
    "style": "#icon-1899-0288D1",
    "lng": 106.240692,
    "lat": -6.113263,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D60",
    "style": "#icon-1899-0288D1",
    "lng": 106.244446,
    "lat": -6.112872,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D61",
    "style": "#icon-1899-0288D1",
    "lng": 106.248244,
    "lat": -6.112333,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D62",
    "style": "#icon-1899-0288D1",
    "lng": 106.252296,
    "lat": -6.111908,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D63",
    "style": "#icon-1899-0288D1",
    "lng": 106.256056,
    "lat": -6.111431,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D64",
    "style": "#icon-1899-0288D1",
    "lng": 106.259895,
    "lat": -6.110899,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D65",
    "style": "#icon-1899-0288D1",
    "lng": 106.263792,
    "lat": -6.110459,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D66",
    "style": "#icon-1899-0288D1",
    "lng": 106.267659,
    "lat": -6.109901,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D67",
    "style": "#icon-1899-0288D1",
    "lng": 106.27217,
    "lat": -6.10921,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D68",
    "style": "#icon-1899-0288D1",
    "lng": 106.27567,
    "lat": -6.10901,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D69",
    "style": "#icon-1899-0288D1",
    "lng": 106.279182,
    "lat": -6.108563,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A70",
    "style": "#icon-1899-0288D1",
    "lng": 106.2829,
    "lat": -6.108063,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D71",
    "style": "#icon-1899-0288D1",
    "lng": 106.28532,
    "lat": -6.10688,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D72",
    "style": "#icon-1899-0288D1",
    "lng": 106.28801,
    "lat": -6.1058,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH73",
    "style": "#icon-1899-0288D1",
    "lng": 106.290779,
    "lat": -6.104421,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D74",
    "style": "#icon-1899-0288D1",
    "lng": 106.293458,
    "lat": -6.105733,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D75",
    "style": "#icon-1899-0288D1",
    "lng": 106.296693,
    "lat": -6.107472,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A75B",
    "style": "#icon-1899-0288D1",
    "lng": 106.300131,
    "lat": -6.109196,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D76",
    "style": "#icon-1899-0288D1",
    "lng": 106.302195,
    "lat": -6.111948,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A76B",
    "style": "#icon-1899-0288D1",
    "lng": 106.30382,
    "lat": -6.11433,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D77",
    "style": "#icon-1899-0288D1",
    "lng": 106.305384,
    "lat": -6.117332,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D78",
    "style": "#icon-1899-0288D1",
    "lng": 106.306825,
    "lat": -6.120503,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D79",
    "style": "#icon-1899-0288D1",
    "lng": 106.308518,
    "lat": -6.123832,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D80",
    "style": "#icon-1899-0288D1",
    "lng": 106.310063,
    "lat": -6.127031,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D81",
    "style": "#icon-1899-0288D1",
    "lng": 106.311614,
    "lat": -6.130306,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A82",
    "style": "#icon-1899-0288D1",
    "lng": 106.313165,
    "lat": -6.13348,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D83",
    "style": "#icon-1899-0288D1",
    "lng": 106.315712,
    "lat": -6.136075,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D84",
    "style": "#icon-1899-0288D1",
    "lng": 106.318264,
    "lat": -6.13861,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D85",
    "style": "#icon-1899-0288D1",
    "lng": 106.321337,
    "lat": -6.141776,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH86",
    "style": "#icon-1899-0288D1",
    "lng": 106.322738,
    "lat": -6.143202,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH87",
    "style": "#icon-1899-0288D1",
    "lng": 106.325067,
    "lat": -6.142988,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH88",
    "style": "#icon-1899-0288D1",
    "lng": 106.329341,
    "lat": -6.145421,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH89",
    "style": "#icon-1899-0288D1",
    "lng": 106.329903,
    "lat": -6.149772,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D90",
    "style": "#icon-1899-0288D1",
    "lng": 106.332086,
    "lat": -6.15194,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D91",
    "style": "#icon-1899-0288D1",
    "lng": 106.334696,
    "lat": -6.154443,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D92B",
    "style": "#icon-1899-0288D1",
    "lng": 106.336412,
    "lat": -6.155933,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH92",
    "style": "#icon-1899-0288D1",
    "lng": 106.338723,
    "lat": -6.157934,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH93A",
    "style": "#icon-1899-0288D1",
    "lng": 106.342195,
    "lat": -6.15835,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH93",
    "style": "#icon-1899-0288D1",
    "lng": 106.342743,
    "lat": -6.161667,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH94",
    "style": "#icon-1899-0288D1",
    "lng": 106.345189,
    "lat": -6.161807,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D95",
    "style": "#icon-1899-0288D1",
    "lng": 106.34646,
    "lat": -6.16335,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH96",
    "style": "#icon-1899-0288D1",
    "lng": 106.349054,
    "lat": -6.166593,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D97",
    "style": "#icon-1899-0288D1",
    "lng": 106.35294,
    "lat": -6.16652,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D98",
    "style": "#icon-1899-0288D1",
    "lng": 106.35681,
    "lat": -6.16673,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D99",
    "style": "#icon-1899-0288D1",
    "lng": 106.36067,
    "lat": -6.16683,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D100",
    "style": "#icon-1899-0288D1",
    "lng": 106.36421,
    "lat": -6.166956,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D101",
    "style": "#icon-1899-0288D1",
    "lng": 106.368284,
    "lat": -6.167081,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D102",
    "style": "#icon-1899-0288D1",
    "lng": 106.372334,
    "lat": -6.167237,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D103",
    "style": "#icon-1899-0288D1",
    "lng": 106.376107,
    "lat": -6.167402,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D104",
    "style": "#icon-1899-0288D1",
    "lng": 106.38031,
    "lat": -6.16762,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D105",
    "style": "#icon-1899-0288D1",
    "lng": 106.38409,
    "lat": -6.167722,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A106",
    "style": "#icon-1899-0288D1",
    "lng": 106.388404,
    "lat": -6.167953,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D107",
    "style": "#icon-1899-0288D1",
    "lng": 106.39171,
    "lat": -6.16803,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D108",
    "style": "#icon-1899-0288D1",
    "lng": 106.39433,
    "lat": -6.16815,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D109",
    "style": "#icon-1899-0288D1",
    "lng": 106.39811,
    "lat": -6.1684,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D110",
    "style": "#icon-1899-0288D1",
    "lng": 106.401076,
    "lat": -6.168576,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D111A",
    "style": "#icon-1899-0288D1",
    "lng": 106.404396,
    "lat": -6.168856,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH111",
    "style": "#icon-1899-0288D1",
    "lng": 106.404811,
    "lat": -6.169578,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D112",
    "style": "#icon-1899-0288D1",
    "lng": 106.406596,
    "lat": -6.17251,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D113",
    "style": "#icon-1899-0288D1",
    "lng": 106.40869,
    "lat": -6.17601,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A114",
    "style": "#icon-1899-0288D1",
    "lng": 106.41073,
    "lat": -6.17958,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D115",
    "style": "#icon-1899-0288D1",
    "lng": 106.41254,
    "lat": -6.18257,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D116",
    "style": "#icon-1899-0288D1",
    "lng": 106.41451,
    "lat": -6.18571,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D117",
    "style": "#icon-1899-0288D1",
    "lng": 106.41662,
    "lat": -6.18911,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH118",
    "style": "#icon-1899-0288D1",
    "lng": 106.41816,
    "lat": -6.19179,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #AH119",
    "style": "#icon-1899-0288D1",
    "lng": 106.417682,
    "lat": -6.19428,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A120 (Diganti menjadi Jalur BalKem Tower A2)",
    "style": "#icon-1899-0288D1",
    "lng": 106.41989,
    "lat": -6.1961,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #D121 (Unstringing)",
    "style": "#icon-1899-0288D1",
    "lng": 106.422022,
    "lat": -6.198128,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #EA122",
    "style": "#icon-1899-0288D1",
    "lng": 106.421552,
    "lat": -6.199431,
    "type": "SUTET_500kV"
  },
  {
    "name": "Tower SUTET JAWA7-BLRJA 500kV #AH9A(NEW)",
    "style": "#icon-1899-0288D1",
    "lng": 106.101541,
    "lat": -6.025325,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET JAWA7-BLRJA 500kV #A120N(NEW)",
    "style": "#icon-1899-0288D1",
    "lng": 106.420352,
    "lat": -6.197541,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.4216126,
    "lat": -6.19878949,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.4198616,
    "lat": -6.196171561,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.4194086,
    "lat": -6.192347362,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.4182677,
    "lat": -6.188090909,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.4181593,
    "lat": -6.184736048,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.4184835,
    "lat": -6.180927854,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.4188076,
    "lat": -6.177092531,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.4190883,
    "lat": -6.173899415,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0009",
    "style": "#icon-1899-0288D1",
    "lng": 106.4180044,
    "lat": -6.170655674,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0010",
    "style": "#icon-1899-0288D1",
    "lng": 106.4179276,
    "lat": -6.1689557,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0011",
    "style": "#icon-1899-0288D1",
    "lng": 106.4207485,
    "lat": -6.166217029,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0012",
    "style": "#icon-1899-0288D1",
    "lng": 106.4242601,
    "lat": -6.164950606,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0013",
    "style": "#icon-1899-0288D1",
    "lng": 106.4276634,
    "lat": -6.163738714,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0014",
    "style": "#icon-1899-0288D1",
    "lng": 106.4309042,
    "lat": -6.162572458,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0015",
    "style": "#icon-1899-0288D1",
    "lng": 106.434488,
    "lat": -6.161305784,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0016",
    "style": "#icon-1899-0288D1",
    "lng": 106.4377468,
    "lat": -6.160139444,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0017",
    "style": "#icon-1899-0288D1",
    "lng": 106.4411515,
    "lat": -6.15946104,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0018",
    "style": "#icon-1899-0288D1",
    "lng": 106.4434722,
    "lat": -6.158903116,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0019",
    "style": "#icon-1899-0288D1",
    "lng": 106.4473643,
    "lat": -6.158069618,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0020",
    "style": "#icon-1899-0288D1",
    "lng": 106.4513858,
    "lat": -6.158302866,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0021",
    "style": "#icon-1899-0288D1",
    "lng": 106.4549337,
    "lat": -6.160454575,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0022",
    "style": "#icon-1899-0288D1",
    "lng": 106.4573468,
    "lat": -6.163956822,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0023",
    "style": "#icon-1899-0288D1",
    "lng": 106.4614486,
    "lat": -6.163791854,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0024",
    "style": "#icon-1899-0288D1",
    "lng": 106.4650128,
    "lat": -6.165310398,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0025",
    "style": "#icon-1899-0288D1",
    "lng": 106.4693456,
    "lat": -6.166989574,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0026",
    "style": "#icon-1899-0288D1",
    "lng": 106.4730003,
    "lat": -6.168553021,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0027",
    "style": "#icon-1899-0288D1",
    "lng": 106.476019,
    "lat": -6.168825007,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0028",
    "style": "#icon-1899-0288D1",
    "lng": 106.4786403,
    "lat": -6.169152338,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0029",
    "style": "#icon-1899-0288D1",
    "lng": 106.4786119,
    "lat": -6.171937754,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0030",
    "style": "#icon-1899-0288D1",
    "lng": 106.4785821,
    "lat": -6.174234835,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0031",
    "style": "#icon-1899-0288D1",
    "lng": 106.4764494,
    "lat": -6.177396872,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0032",
    "style": "#icon-1899-0288D1",
    "lng": 106.4758637,
    "lat": -6.181241904,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0033",
    "style": "#icon-1899-0288D1",
    "lng": 106.4781963,
    "lat": -6.184970305,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0034",
    "style": "#icon-1899-0288D1",
    "lng": 106.480154,
    "lat": -6.187099071,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0035",
    "style": "#icon-1899-0288D1",
    "lng": 106.4826747,
    "lat": -6.190202928,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0036",
    "style": "#icon-1899-0288D1",
    "lng": 106.4845388,
    "lat": -6.191183434,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0037",
    "style": "#icon-1899-0288D1",
    "lng": 106.4832226,
    "lat": -6.195518843,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0038",
    "style": "#icon-1899-0288D1",
    "lng": 106.4827653,
    "lat": -6.196768094,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0039",
    "style": "#icon-1899-0288D1",
    "lng": 106.4863673,
    "lat": -6.198774657,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0040",
    "style": "#icon-1899-0288D1",
    "lng": 106.4889961,
    "lat": -6.198495982,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0041",
    "style": "#icon-1899-0288D1",
    "lng": 106.4927581,
    "lat": -6.199534417,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0042",
    "style": "#icon-1899-0288D1",
    "lng": 106.4946839,
    "lat": -6.199935935,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0043",
    "style": "#icon-1899-0288D1",
    "lng": 106.4975591,
    "lat": -6.200533714,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0044",
    "style": "#icon-1899-0288D1",
    "lng": 106.5007871,
    "lat": -6.201257082,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0045",
    "style": "#icon-1899-0288D1",
    "lng": 106.502532,
    "lat": -6.201559606,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0046",
    "style": "#icon-1899-0288D1",
    "lng": 106.5052992,
    "lat": -6.202329465,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0047",
    "style": "#icon-1899-0288D1",
    "lng": 106.5079664,
    "lat": -6.202846384,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0048",
    "style": "#icon-1899-0288D1",
    "lng": 106.5107607,
    "lat": -6.203579962,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0049",
    "style": "#icon-1899-0288D1",
    "lng": 106.5125693,
    "lat": -6.204054087,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0050",
    "style": "#icon-1899-0288D1",
    "lng": 106.5147027,
    "lat": -6.204373543,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0051",
    "style": "#icon-1899-0288D1",
    "lng": 106.5173334,
    "lat": -6.204763911,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0052",
    "style": "#icon-1899-0288D1",
    "lng": 106.5198188,
    "lat": -6.204901474,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0053",
    "style": "#icon-1899-0288D1",
    "lng": 106.520874,
    "lat": -6.206009,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0054",
    "style": "#icon-1899-0288D1",
    "lng": 106.519697,
    "lat": -6.208103,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0055",
    "style": "#icon-1899-0288D1",
    "lng": 106.519944,
    "lat": -6.210685,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0056",
    "style": "#icon-1899-0288D1",
    "lng": 106.52032,
    "lat": -6.213653,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0057",
    "style": "#icon-1899-0288D1",
    "lng": 106.520612,
    "lat": -6.216162,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0058",
    "style": "#icon-1899-0288D1",
    "lng": 106.521033,
    "lat": -6.218767,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0059",
    "style": "#icon-1899-0288D1",
    "lng": 106.521234,
    "lat": -6.221337,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0060",
    "style": "#icon-1899-0288D1",
    "lng": 106.522579,
    "lat": -6.223471,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0061",
    "style": "#icon-1899-0288D1",
    "lng": 106.52346,
    "lat": -6.224735,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0062",
    "style": "#icon-1899-0288D1",
    "lng": 106.524328,
    "lat": -6.225716,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0063",
    "style": "#icon-1899-0288D1",
    "lng": 106.523647,
    "lat": -6.2279,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0064",
    "style": "#icon-1899-0288D1",
    "lng": 106.523639,
    "lat": -6.229499,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0065",
    "style": "#icon-1899-0288D1",
    "lng": 106.523949,
    "lat": -6.232325,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0066",
    "style": "#icon-1899-0288D1",
    "lng": 106.525518,
    "lat": -6.232805,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0067",
    "style": "#icon-1899-0288D1",
    "lng": 106.527934,
    "lat": -6.233326,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0068",
    "style": "#icon-1899-0288D1",
    "lng": 106.530646,
    "lat": -6.233877,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0069",
    "style": "#icon-1899-0288D1",
    "lng": 106.533083,
    "lat": -6.234367,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0070",
    "style": "#icon-1899-0288D1",
    "lng": 106.535856,
    "lat": -6.234948,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0071",
    "style": "#icon-1899-0288D1",
    "lng": 106.538168,
    "lat": -6.235439,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0072",
    "style": "#icon-1899-0288D1",
    "lng": 106.540713,
    "lat": -6.236023,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0073",
    "style": "#icon-1899-0288D1",
    "lng": 106.543514,
    "lat": -6.236586,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0074",
    "style": "#icon-1899-0288D1",
    "lng": 106.547309,
    "lat": -6.235231,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0075",
    "style": "#icon-1899-0288D1",
    "lng": 106.551279,
    "lat": -6.233886,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0076",
    "style": "#icon-1899-0288D1",
    "lng": 106.553625,
    "lat": -6.234291,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0077",
    "style": "#icon-1899-0288D1",
    "lng": 106.555786,
    "lat": -6.234631,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0078",
    "style": "#icon-1899-0288D1",
    "lng": 106.558439,
    "lat": -6.235106,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0079",
    "style": "#icon-1899-0288D1",
    "lng": 106.561401,
    "lat": -6.235507,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0080",
    "style": "#icon-1899-0288D1",
    "lng": 106.563586,
    "lat": -6.235952,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0081",
    "style": "#icon-1899-0288D1",
    "lng": 106.565367,
    "lat": -6.236043,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0082",
    "style": "#icon-1899-0288D1",
    "lng": 106.567419,
    "lat": -6.236123,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0083",
    "style": "#icon-1899-0288D1",
    "lng": 106.569946,
    "lat": -6.23434,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0084",
    "style": "#icon-1899-0288D1",
    "lng": 106.5719804,
    "lat": -6.2354443,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0085",
    "style": "#icon-1899-0288D1",
    "lng": 106.574371,
    "lat": -6.236756,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0086",
    "style": "#icon-1899-0288D1",
    "lng": 106.576974,
    "lat": -6.238093,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0087",
    "style": "#icon-1899-0288D1",
    "lng": 106.578167,
    "lat": -6.238683,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0088",
    "style": "#icon-1899-0288D1",
    "lng": 106.57947,
    "lat": -6.239395,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0089",
    "style": "#icon-1899-0288D1",
    "lng": 106.582111,
    "lat": -6.2408,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0090",
    "style": "#icon-1899-0288D1",
    "lng": 106.584679,
    "lat": -6.242173,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0091",
    "style": "#icon-1899-0288D1",
    "lng": 106.587233,
    "lat": -6.243585,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0092",
    "style": "#icon-1899-0288D1",
    "lng": 106.589314,
    "lat": -6.244726,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0094",
    "style": "#icon-1899-0288D1",
    "lng": 106.594426,
    "lat": -6.246154,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0095",
    "style": "#icon-1899-0288D1",
    "lng": 106.596941,
    "lat": -6.246258,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0096",
    "style": "#icon-1899-0288D1",
    "lng": 106.599863,
    "lat": -6.246359,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0097",
    "style": "#icon-1899-0288D1",
    "lng": 106.602421,
    "lat": -6.246433,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0098",
    "style": "#icon-1899-0288D1",
    "lng": 106.6051746,
    "lat": -6.2469393,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0093",
    "style": "#icon-1899-0288D1",
    "lng": 106.591762,
    "lat": -6.246069,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0099",
    "style": "#icon-1899-0288D1",
    "lng": 106.6071975,
    "lat": -6.2474314,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0100",
    "style": "#icon-1899-0288D1",
    "lng": 106.6089976,
    "lat": -6.2473793,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0101",
    "style": "#icon-1899-0288D1",
    "lng": 106.609628,
    "lat": -6.247031,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0102",
    "style": "#icon-1899-0288D1",
    "lng": 106.611513,
    "lat": -6.247182,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0103",
    "style": "#icon-1899-0288D1",
    "lng": 106.613612,
    "lat": -6.247311,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0104",
    "style": "#icon-1899-0288D1",
    "lng": 106.616375,
    "lat": -6.245974,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0105",
    "style": "#icon-1899-0288D1",
    "lng": 106.618926,
    "lat": -6.24477,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0106",
    "style": "#icon-1899-0288D1",
    "lng": 106.621805,
    "lat": -6.24331,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0107",
    "style": "#icon-1899-0288D1",
    "lng": 106.624766,
    "lat": -6.241943,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0108",
    "style": "#icon-1899-0288D1",
    "lng": 106.627001,
    "lat": -6.240783,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0109",
    "style": "#icon-1899-0288D1",
    "lng": 106.627702,
    "lat": -6.238977,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0110",
    "style": "#icon-1899-0288D1",
    "lng": 106.628398,
    "lat": -6.237172,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0111",
    "style": "#icon-1899-0288D1",
    "lng": 106.629545,
    "lat": -6.2376,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0112",
    "style": "#icon-1899-0288D1",
    "lng": 106.632859,
    "lat": -6.238785,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0113",
    "style": "#icon-1899-0288D1",
    "lng": 106.635359,
    "lat": -6.239103,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0114",
    "style": "#icon-1899-0288D1",
    "lng": 106.638946,
    "lat": -6.239548,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0115",
    "style": "#icon-1899-0288D1",
    "lng": 106.641319,
    "lat": -6.239747,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0116",
    "style": "#icon-1899-0288D1",
    "lng": 106.643607,
    "lat": -6.239879,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0117",
    "style": "#icon-1899-0288D1",
    "lng": 106.64453,
    "lat": -6.238191,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0118",
    "style": "#icon-1899-0288D1",
    "lng": 106.646177,
    "lat": -6.236973,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0119",
    "style": "#icon-1899-0288D1",
    "lng": 106.64808,
    "lat": -6.235004,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0120",
    "style": "#icon-1899-0288D1",
    "lng": 106.649603,
    "lat": -6.233419,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0121",
    "style": "#icon-1899-0288D1",
    "lng": 106.650176,
    "lat": -6.231634,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0122",
    "style": "#icon-1899-0288D1",
    "lng": 106.65117,
    "lat": -6.228977,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0123",
    "style": "#icon-1899-0288D1",
    "lng": 106.652389,
    "lat": -6.226638,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0124",
    "style": "#icon-1899-0288D1",
    "lng": 106.653614,
    "lat": -6.224542,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0125",
    "style": "#icon-1899-0288D1",
    "lng": 106.654553,
    "lat": -6.222567,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0126",
    "style": "#icon-1899-0288D1",
    "lng": 106.655758,
    "lat": -6.220546,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0127",
    "style": "#icon-1899-0288D1",
    "lng": 106.65651,
    "lat": -6.218755,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0128",
    "style": "#icon-1899-0288D1",
    "lng": 106.657763,
    "lat": -6.216917,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0129",
    "style": "#icon-1899-0288D1",
    "lng": 106.658865,
    "lat": -6.215152,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0130",
    "style": "#icon-1899-0288D1",
    "lng": 106.661297,
    "lat": -6.214808,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0131",
    "style": "#icon-1899-0288D1",
    "lng": 106.663974,
    "lat": -6.214416,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0132",
    "style": "#icon-1899-0288D1",
    "lng": 106.666669,
    "lat": -6.214019,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0133",
    "style": "#icon-1899-0288D1",
    "lng": 106.669166,
    "lat": -6.213635,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0134",
    "style": "#icon-1899-0288D1",
    "lng": 106.671827,
    "lat": -6.213206,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0135",
    "style": "#icon-1899-0288D1",
    "lng": 106.674499,
    "lat": -6.212845,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0136",
    "style": "#icon-1899-0288D1",
    "lng": 106.676823,
    "lat": -6.212489,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0137",
    "style": "#icon-1899-0288D1",
    "lng": 106.679311,
    "lat": -6.212125,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0138",
    "style": "#icon-1899-0288D1",
    "lng": 106.681887,
    "lat": -6.211743,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0139",
    "style": "#icon-1899-0288D1",
    "lng": 106.683958,
    "lat": -6.211505,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0140",
    "style": "#icon-1899-0288D1",
    "lng": 106.686492,
    "lat": -6.211011,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0141",
    "style": "#icon-1899-0288D1",
    "lng": 106.688918,
    "lat": -6.210568,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0142",
    "style": "#icon-1899-0288D1",
    "lng": 106.691423,
    "lat": -6.210288,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0143",
    "style": "#icon-1899-0288D1",
    "lng": 106.693669,
    "lat": -6.209264,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0144",
    "style": "#icon-1899-0288D1",
    "lng": 106.696033,
    "lat": -6.208148,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0145",
    "style": "#icon-1899-0288D1",
    "lng": 106.698675,
    "lat": -6.206271,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0146",
    "style": "#icon-1899-0288D1",
    "lng": 106.700231,
    "lat": -6.205273,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0147",
    "style": "#icon-1899-0288D1",
    "lng": 106.70251,
    "lat": -6.203722,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0148",
    "style": "#icon-1899-0288D1",
    "lng": 106.704488,
    "lat": -6.202343,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0149",
    "style": "#icon-1899-0288D1",
    "lng": 106.706341,
    "lat": -6.200933,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0150",
    "style": "#icon-1899-0288D1",
    "lng": 106.708366,
    "lat": -6.199411,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0151",
    "style": "#icon-1899-0288D1",
    "lng": 106.710771,
    "lat": -6.197396,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0152",
    "style": "#icon-1899-0288D1",
    "lng": 106.711759,
    "lat": -6.194768,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0153",
    "style": "#icon-1899-0288D1",
    "lng": 106.712679,
    "lat": -6.192577,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0154",
    "style": "#icon-1899-0288D1",
    "lng": 106.714389,
    "lat": -6.191138,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0155",
    "style": "#icon-1899-0288D1",
    "lng": 106.715658,
    "lat": -6.190008,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0156",
    "style": "#icon-1899-0288D1",
    "lng": 106.717085,
    "lat": -6.188882,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV BLRJA-KMBNG #0157",
    "style": "#icon-1899-0288D1",
    "lng": 106.719203,
    "lat": -6.187348,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.7874167,
    "lat": -6.3452933,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.7865333,
    "lat": -6.3449956,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.7854232,
    "lat": -6.3462988,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.7845528,
    "lat": -6.3478038,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.7829978,
    "lat": -6.3504655,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.7819515,
    "lat": -6.3522896,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.780808,
    "lat": -6.3543415,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.7793907,
    "lat": -6.3567986,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0009",
    "style": "#icon-1899-0288D1",
    "lng": 106.7776549,
    "lat": -6.3578163,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0010",
    "style": "#icon-1899-0288D1",
    "lng": 106.7753182,
    "lat": -6.3590969,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0011",
    "style": "#icon-1899-0288D1",
    "lng": 106.7735991,
    "lat": -6.3600938,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0012",
    "style": "#icon-1899-0288D1",
    "lng": 106.7718914,
    "lat": -6.3622167,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0013",
    "style": "#icon-1899-0288D1",
    "lng": 106.7704513,
    "lat": -6.3639819,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0014",
    "style": "#icon-1899-0288D1",
    "lng": 106.7681212,
    "lat": -6.3668924,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0015",
    "style": "#icon-1899-0288D1",
    "lng": 106.7663897,
    "lat": -6.3690854,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0016",
    "style": "#icon-1899-0288D1",
    "lng": 106.7642386,
    "lat": -6.3717491,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0017",
    "style": "#icon-1899-0288D1",
    "lng": 106.7618863,
    "lat": -6.3747445,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0018",
    "style": "#icon-1899-0288D1",
    "lng": 106.7601453,
    "lat": -6.3769409,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0019",
    "style": "#icon-1899-0288D1",
    "lng": 106.7586591,
    "lat": -6.37881,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0020",
    "style": "#icon-1899-0288D1",
    "lng": 106.7563905,
    "lat": -6.3788117,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0021",
    "style": "#icon-1899-0288D1",
    "lng": 106.7535761,
    "lat": -6.3788063,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0022",
    "style": "#icon-1899-0288D1",
    "lng": 106.7504181,
    "lat": -6.378753,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0023",
    "style": "#icon-1899-0288D1",
    "lng": 106.7478693,
    "lat": -6.3787625,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0024",
    "style": "#icon-1899-0288D1",
    "lng": 106.7443646,
    "lat": -6.3787491,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0025",
    "style": "#icon-1899-0288D1",
    "lng": 106.7407037,
    "lat": -6.3786824,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0026",
    "style": "#icon-1899-0288D1",
    "lng": 106.7368465,
    "lat": -6.3786484,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0027",
    "style": "#icon-1899-0288D1",
    "lng": 106.7361247,
    "lat": -6.3757204,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0028",
    "style": "#icon-1899-0288D1",
    "lng": 106.7354412,
    "lat": -6.3727895,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0029",
    "style": "#icon-1899-0288D1",
    "lng": 106.7346183,
    "lat": -6.3693673,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0030",
    "style": "#icon-1899-0288D1",
    "lng": 106.7339597,
    "lat": -6.3665468,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0031",
    "style": "#icon-1899-0288D1",
    "lng": 106.7331225,
    "lat": -6.363023,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0032",
    "style": "#icon-1899-0288D1",
    "lng": 106.7324011,
    "lat": -6.3603266,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0033",
    "style": "#icon-1899-0288D1",
    "lng": 106.7303141,
    "lat": -6.3566211,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0034",
    "style": "#icon-1899-0288D1",
    "lng": 106.7288727,
    "lat": -6.3541251,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0035",
    "style": "#icon-1899-0288D1",
    "lng": 106.7274204,
    "lat": -6.35157,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0036",
    "style": "#icon-1899-0288D1",
    "lng": 106.725688,
    "lat": -6.3485723,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0037",
    "style": "#icon-1899-0288D1",
    "lng": 106.7238716,
    "lat": -6.345433,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0038",
    "style": "#icon-1899-0288D1",
    "lng": 106.7238849,
    "lat": -6.341873,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0039",
    "style": "#icon-1899-0288D1",
    "lng": 106.7239123,
    "lat": -6.3378623,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0040",
    "style": "#icon-1899-0288D1",
    "lng": 106.7239182,
    "lat": -6.3351492,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0041",
    "style": "#icon-1899-0288D1",
    "lng": 106.7239304,
    "lat": -6.3317382,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0042",
    "style": "#icon-1899-0288D1",
    "lng": 106.7239506,
    "lat": -6.3281038,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0043",
    "style": "#icon-1899-0288D1",
    "lng": 106.723954,
    "lat": -6.3248327,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0044",
    "style": "#icon-1899-0288D1",
    "lng": 106.7232766,
    "lat": -6.3219027,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0045",
    "style": "#icon-1899-0288D1",
    "lng": 106.7225534,
    "lat": -6.318947,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0046",
    "style": "#icon-1899-0288D1",
    "lng": 106.7218486,
    "lat": -6.315972,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0047",
    "style": "#icon-1899-0288D1",
    "lng": 106.7209411,
    "lat": -6.3123544,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0048",
    "style": "#icon-1899-0288D1",
    "lng": 106.7199469,
    "lat": -6.308582,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0049",
    "style": "#icon-1899-0288D1",
    "lng": 106.7191223,
    "lat": -6.3049216,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0050",
    "style": "#icon-1899-0288D1",
    "lng": 106.7184061,
    "lat": -6.3016683,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0051",
    "style": "#icon-1899-0288D1",
    "lng": 106.7175663,
    "lat": -6.2978306,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0052",
    "style": "#icon-1899-0288D1",
    "lng": 106.7167674,
    "lat": -6.2944256,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0053",
    "style": "#icon-1899-0288D1",
    "lng": 106.7160299,
    "lat": -6.2913311,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0054",
    "style": "#icon-1899-0288D1",
    "lng": 106.7154178,
    "lat": -6.2885646,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0055",
    "style": "#icon-1899-0288D1",
    "lng": 106.7145923,
    "lat": -6.2853337,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0056",
    "style": "#icon-1899-0288D1",
    "lng": 106.7139126,
    "lat": -6.2823924,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0057",
    "style": "#icon-1899-0288D1",
    "lng": 106.7132716,
    "lat": -6.2794474,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0058",
    "style": "#icon-1899-0288D1",
    "lng": 106.7127262,
    "lat": -6.277064,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0059",
    "style": "#icon-1899-0288D1",
    "lng": 106.7118769,
    "lat": -6.273331,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0060",
    "style": "#icon-1899-0288D1",
    "lng": 106.7111143,
    "lat": -6.2701965,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0061",
    "style": "#icon-1899-0288D1",
    "lng": 106.7103313,
    "lat": -6.2668514,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0062",
    "style": "#icon-1899-0288D1",
    "lng": 106.7095109,
    "lat": -6.2631315,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0063",
    "style": "#icon-1899-0288D1",
    "lng": 106.7088402,
    "lat": -6.2604578,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0064",
    "style": "#icon-1899-0288D1",
    "lng": 106.7082148,
    "lat": -6.2575613,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0065",
    "style": "#icon-1899-0288D1",
    "lng": 106.7072921,
    "lat": -6.2535955,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0066",
    "style": "#icon-1899-0288D1",
    "lng": 106.7065062,
    "lat": -6.2500312,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0067",
    "style": "#icon-1899-0288D1",
    "lng": 106.7056522,
    "lat": -6.2467314,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0068",
    "style": "#icon-1899-0288D1",
    "lng": 106.7048182,
    "lat": -6.2434967,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0069",
    "style": "#icon-1899-0288D1",
    "lng": 106.703957,
    "lat": -6.2400238,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0070",
    "style": "#icon-1899-0288D1",
    "lng": 106.7032325,
    "lat": -6.2370659,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0071",
    "style": "#icon-1899-0288D1",
    "lng": 106.7016695,
    "lat": -6.2337219,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0072",
    "style": "#icon-1899-0288D1",
    "lng": 106.7001462,
    "lat": -6.2303928,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0073",
    "style": "#icon-1899-0288D1",
    "lng": 106.6986356,
    "lat": -6.2272104,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0074",
    "style": "#icon-1899-0288D1",
    "lng": 106.6972322,
    "lat": -6.2242089,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0075",
    "style": "#icon-1899-0288D1",
    "lng": 106.6982905,
    "lat": -6.2223031,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0076",
    "style": "#icon-1899-0288D1",
    "lng": 106.7001261,
    "lat": -6.219001,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0077",
    "style": "#icon-1899-0288D1",
    "lng": 106.7015019,
    "lat": -6.2164075,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0078",
    "style": "#icon-1899-0288D1",
    "lng": 106.7034496,
    "lat": -6.2128258,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0079",
    "style": "#icon-1899-0288D1",
    "lng": 106.7046232,
    "lat": -6.2107593,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0080",
    "style": "#icon-1899-0288D1",
    "lng": 106.7061542,
    "lat": -6.2079407,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0081",
    "style": "#icon-1899-0288D1",
    "lng": 106.7078936,
    "lat": -6.2047995,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0082",
    "style": "#icon-1899-0288D1",
    "lng": 106.7095845,
    "lat": -6.2017514,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0083",
    "style": "#icon-1899-0288D1",
    "lng": 106.7123039,
    "lat": -6.1993708,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0084",
    "style": "#icon-1899-0288D1",
    "lng": 106.71489,
    "lat": -6.1970986,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0085",
    "style": "#icon-1899-0288D1",
    "lng": 106.7168056,
    "lat": -6.1954299,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG #0086",
    "style": "#icon-1899-0288D1",
    "lng": 106.7190112,
    "lat": -6.1934578,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG+DKSBI #0087",
    "style": "#icon-1899-0288D1",
    "lng": 106.7196491,
    "lat": -6.1911967,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG+DKSBI #0088",
    "style": "#icon-1899-0288D1",
    "lng": 106.7196077,
    "lat": -6.189681,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500kV GNDUL-KMBNG+DKSBI #0089",
    "style": "#icon-1899-0288D1",
    "lng": 106.7199444,
    "lat": -6.188925,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.7254149,
    "lat": -6.172373671,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.7265221,
    "lat": -6.17150524,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.7285154,
    "lat": -6.170568963,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.7290794,
    "lat": -6.170111266,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.7301109,
    "lat": -6.167955689,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.7312954,
    "lat": -6.16538523,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.7325247,
    "lat": -6.162916317,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.7336925,
    "lat": -6.160463161,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0009",
    "style": "#icon-1899-0288D1",
    "lng": 106.7350064,
    "lat": -6.157707609,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0010",
    "style": "#icon-1899-0288D1",
    "lng": 106.7360613,
    "lat": -6.155340006,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0011",
    "style": "#icon-1899-0288D1",
    "lng": 106.73677,
    "lat": -6.15398,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0012",
    "style": "#icon-1899-0288D1",
    "lng": 106.73784,
    "lat": -6.15234,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0013",
    "style": "#icon-1899-0288D1",
    "lng": 106.7396385,
    "lat": -6.150131833,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0014",
    "style": "#icon-1899-0288D1",
    "lng": 106.7413532,
    "lat": -6.148019169,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0015",
    "style": "#icon-1899-0288D1",
    "lng": 106.7430335,
    "lat": -6.145766468,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0016",
    "style": "#icon-1899-0288D1",
    "lng": 106.7448763,
    "lat": -6.143471634,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0017",
    "style": "#icon-1899-0288D1",
    "lng": 106.746804,
    "lat": -6.141118128,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0018",
    "style": "#icon-1899-0288D1",
    "lng": 106.7485545,
    "lat": -6.138874451,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0019",
    "style": "#icon-1899-0288D1",
    "lng": 106.7503842,
    "lat": -6.136573699,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0020",
    "style": "#icon-1899-0288D1",
    "lng": 106.75231,
    "lat": -6.13407,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0021",
    "style": "#icon-1899-0288D1",
    "lng": 106.75275,
    "lat": -6.1313,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0022",
    "style": "#icon-1899-0288D1",
    "lng": 106.7525,
    "lat": -6.12872,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0023",
    "style": "#icon-1899-0288D1",
    "lng": 106.75223,
    "lat": -6.12585,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0024",
    "style": "#icon-1899-0288D1",
    "lng": 106.75199,
    "lat": -6.12304,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0025",
    "style": "#icon-1899-0288D1",
    "lng": 106.75171,
    "lat": -6.1199,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0026",
    "style": "#icon-1899-0288D1",
    "lng": 106.7513827,
    "lat": -6.117324555,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0027",
    "style": "#icon-1899-0288D1",
    "lng": 106.75127,
    "lat": -6.11436,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0028",
    "style": "#icon-1899-0288D1",
    "lng": 106.75357,
    "lat": -6.11313,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0029",
    "style": "#icon-1899-0288D1",
    "lng": 106.756,
    "lat": -6.11172,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0030",
    "style": "#icon-1899-0288D1",
    "lng": 106.75841,
    "lat": -6.1104,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0031",
    "style": "#icon-1899-0288D1",
    "lng": 106.7610291,
    "lat": -6.10895413,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0032",
    "style": "#icon-1899-0288D1",
    "lng": 106.7633864,
    "lat": -6.107661255,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0033",
    "style": "#icon-1899-0288D1",
    "lng": 106.7659002,
    "lat": -6.106300316,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0034",
    "style": "#icon-1899-0288D1",
    "lng": 106.7686248,
    "lat": -6.106228703,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0035",
    "style": "#icon-1899-0288D1",
    "lng": 106.7713705,
    "lat": -6.107221255,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0036",
    "style": "#icon-1899-0288D1",
    "lng": 106.774011,
    "lat": -6.108167752,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0037",
    "style": "#icon-1899-0288D1",
    "lng": 106.77732,
    "lat": -6.10937,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET 500KV MUARAKARANG-DURIKOSAMBI #0038",
    "style": "#icon-1899-0288D1",
    "lng": 106.7807488,
    "lat": -6.110677782,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PA01",
    "style": "#icon-1899-0288D1",
    "lng": 106.725541,
    "lat": -6.172895,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PA02",
    "style": "#icon-1899-0288D1",
    "lng": 106.7274149,
    "lat": -6.172267779,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PA02A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7276389,
    "lat": -6.173349405,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PD08",
    "style": "#icon-1899-0288D1",
    "lng": 106.7310955,
    "lat": -6.190809964,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PD03",
    "style": "#icon-1899-0288D1",
    "lng": 106.7278866,
    "lat": -6.176214984,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PA10",
    "style": "#icon-1899-0288D1",
    "lng": 106.7285522,
    "lat": -6.190542195,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PA11",
    "style": "#icon-1899-0288D1",
    "lng": 106.7253423,
    "lat": -6.19006011,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PA12",
    "style": "#icon-1899-0288D1",
    "lng": 106.7230357,
    "lat": -6.190418532,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PA13",
    "style": "#icon-1899-0288D1",
    "lng": 106.7207176,
    "lat": -6.191091742,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PA04",
    "style": "#icon-1899-0288D1",
    "lng": 106.7281357,
    "lat": -6.17927171,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PD05",
    "style": "#icon-1899-0288D1",
    "lng": 106.7288297,
    "lat": -6.182143159,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PD06",
    "style": "#icon-1899-0288D1",
    "lng": 106.7295284,
    "lat": -6.184840979,
    "type": "SUTET_500kV"
  },
  {
    "name": "TOWER SUTET KMBGN-DKSBI 500kV #PD07",
    "style": "#icon-1899-0288D1",
    "lng": 106.7302883,
    "lat": -6.187702803,
    "type": "SUTET_500kV"
  }
];

// 607 Tower SUTT
export const towerSUTT: TowerPoint[] = [
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5486879,
    "lat": -6.1707133,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5487826,
    "lat": -6.1705039,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5489847,
    "lat": -6.1659711,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.551698,
    "lat": -6.1723297,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5517187,
    "lat": -6.1725287,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5515535,
    "lat": -6.1768853,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.55166,
    "lat": -6.1769798,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.554088,
    "lat": -6.1791659,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5540802,
    "lat": -6.1794943,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA+TGBRU #EA1",
    "style": "#icon-1899-0288D1",
    "lng": 106.4639559,
    "lat": -6.060488446,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA+TGBRU #A2",
    "style": "#icon-1899-0288D1",
    "lng": 106.4648729,
    "lat": -6.063126619,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA+TGBRU #A3",
    "style": "#icon-1899-0288D1",
    "lng": 106.4669515,
    "lat": -6.063488881,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA+TGBRU #D4",
    "style": "#icon-1899-0288D1",
    "lng": 106.4686664,
    "lat": -6.065149434,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA+TGBRU #D5",
    "style": "#icon-1899-0288D1",
    "lng": 106.4706282,
    "lat": -6.067109222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA+TGBRU #AH6",
    "style": "#icon-1899-0288D1",
    "lng": 106.4724811,
    "lat": -6.068949826,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D7",
    "style": "#icon-1899-0288D1",
    "lng": 106.4751275,
    "lat": -6.067755184,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D8",
    "style": "#icon-1899-0288D1",
    "lng": 106.4773504,
    "lat": -6.066787637,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A9",
    "style": "#icon-1899-0288D1",
    "lng": 106.4799218,
    "lat": -6.065555253,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A10",
    "style": "#icon-1899-0288D1",
    "lng": 106.4828027,
    "lat": -6.06380468,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A11",
    "style": "#icon-1899-0288D1",
    "lng": 106.4848119,
    "lat": -6.063343679,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D12",
    "style": "#icon-1899-0288D1",
    "lng": 106.4872651,
    "lat": -6.062234668,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.4896403,
    "lat": -6.061136014,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D14",
    "style": "#icon-1899-0288D1",
    "lng": 106.4923501,
    "lat": -6.059903968,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.4947389,
    "lat": -6.058821339,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D16",
    "style": "#icon-1899-0288D1",
    "lng": 106.4972698,
    "lat": -6.057593191,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D17",
    "style": "#icon-1899-0288D1",
    "lng": 106.4999552,
    "lat": -6.056490006,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D18",
    "style": "#icon-1899-0288D1",
    "lng": 106.5022731,
    "lat": -6.055471665,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A19",
    "style": "#icon-1899-0288D1",
    "lng": 106.50497,
    "lat": -6.054163558,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D20",
    "style": "#icon-1899-0288D1",
    "lng": 106.5073891,
    "lat": -6.053030948,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D21",
    "style": "#icon-1899-0288D1",
    "lng": 106.5103296,
    "lat": -6.051693629,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D22",
    "style": "#icon-1899-0288D1",
    "lng": 106.513083,
    "lat": -6.050439427,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D23",
    "style": "#icon-1899-0288D1",
    "lng": 106.5154035,
    "lat": -6.049366589,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D24",
    "style": "#icon-1899-0288D1",
    "lng": 106.517627,
    "lat": -6.048391539,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D25",
    "style": "#icon-1899-0288D1",
    "lng": 106.51989,
    "lat": -6.04739,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D26",
    "style": "#icon-1899-0288D1",
    "lng": 106.5224307,
    "lat": -6.04625562,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D27",
    "style": "#icon-1899-0288D1",
    "lng": 106.5247822,
    "lat": -6.045197864,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D28",
    "style": "#icon-1899-0288D1",
    "lng": 106.527442,
    "lat": -6.044004,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A29",
    "style": "#icon-1899-0288D1",
    "lng": 106.5300339,
    "lat": -6.042793957,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D30",
    "style": "#icon-1899-0288D1",
    "lng": 106.5328125,
    "lat": -6.043103851,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D31",
    "style": "#icon-1899-0288D1",
    "lng": 106.5355127,
    "lat": -6.04342585,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D32",
    "style": "#icon-1899-0288D1",
    "lng": 106.5382814,
    "lat": -6.043741589,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D33",
    "style": "#icon-1899-0288D1",
    "lng": 106.5409906,
    "lat": -6.044047255,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D34",
    "style": "#icon-1899-0288D1",
    "lng": 106.5435436,
    "lat": -6.044341405,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D35",
    "style": "#icon-1899-0288D1",
    "lng": 106.5462335,
    "lat": -6.044633805,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D36",
    "style": "#icon-1899-0288D1",
    "lng": 106.549101,
    "lat": -6.044967049,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D37",
    "style": "#icon-1899-0288D1",
    "lng": 106.55176,
    "lat": -6.04528032,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D38",
    "style": "#icon-1899-0288D1",
    "lng": 106.554361,
    "lat": -6.045517,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D39",
    "style": "#icon-1899-0288D1",
    "lng": 106.556505,
    "lat": -6.045743,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A40",
    "style": "#icon-1899-0288D1",
    "lng": 106.559017,
    "lat": -6.046175,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D41",
    "style": "#icon-1899-0288D1",
    "lng": 106.5618914,
    "lat": -6.046428069,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D42",
    "style": "#icon-1899-0288D1",
    "lng": 106.564496,
    "lat": -6.046739,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D43",
    "style": "#icon-1899-0288D1",
    "lng": 106.566744,
    "lat": -6.047026381,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D44",
    "style": "#icon-1899-0288D1",
    "lng": 106.5694941,
    "lat": -6.04738909,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A45",
    "style": "#icon-1899-0288D1",
    "lng": 106.5719833,
    "lat": -6.047647333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D46",
    "style": "#icon-1899-0288D1",
    "lng": 106.574389,
    "lat": -6.048239,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A47",
    "style": "#icon-1899-0288D1",
    "lng": 106.577228,
    "lat": -6.04883,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A48",
    "style": "#icon-1899-0288D1",
    "lng": 106.5799167,
    "lat": -6.048623675,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D49",
    "style": "#icon-1899-0288D1",
    "lng": 106.582712,
    "lat": -6.048934,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D50",
    "style": "#icon-1899-0288D1",
    "lng": 106.5856892,
    "lat": -6.049324792,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D51",
    "style": "#icon-1899-0288D1",
    "lng": 106.5886185,
    "lat": -6.049661388,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D52",
    "style": "#icon-1899-0288D1",
    "lng": 106.5907055,
    "lat": -6.049863593,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A53",
    "style": "#icon-1899-0288D1",
    "lng": 106.5936323,
    "lat": -6.05020032,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A54",
    "style": "#icon-1899-0288D1",
    "lng": 106.5966296,
    "lat": -6.050265169,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A55",
    "style": "#icon-1899-0288D1",
    "lng": 106.5991632,
    "lat": -6.050830162,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D56",
    "style": "#icon-1899-0288D1",
    "lng": 106.602046,
    "lat": -6.051104,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D57",
    "style": "#icon-1899-0288D1",
    "lng": 106.6043551,
    "lat": -6.051439691,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D58",
    "style": "#icon-1899-0288D1",
    "lng": 106.6066604,
    "lat": -6.051696967,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D59",
    "style": "#icon-1899-0288D1",
    "lng": 106.6093024,
    "lat": -6.051976701,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D60",
    "style": "#icon-1899-0288D1",
    "lng": 106.6119789,
    "lat": -6.052326577,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D61",
    "style": "#icon-1899-0288D1",
    "lng": 106.6147794,
    "lat": -6.052615326,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D62",
    "style": "#icon-1899-0288D1",
    "lng": 106.6174344,
    "lat": -6.05293522,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D63",
    "style": "#icon-1899-0288D1",
    "lng": 106.6205503,
    "lat": -6.053299314,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D64",
    "style": "#icon-1899-0288D1",
    "lng": 106.6231528,
    "lat": -6.053556673,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D65",
    "style": "#icon-1899-0288D1",
    "lng": 106.6258344,
    "lat": -6.053866233,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A66",
    "style": "#icon-1899-0288D1",
    "lng": 106.6281992,
    "lat": -6.054173165,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D67",
    "style": "#icon-1899-0288D1",
    "lng": 106.6301477,
    "lat": -6.054676475,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A68",
    "style": "#icon-1899-0288D1",
    "lng": 106.6320572,
    "lat": -6.055209777,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A69",
    "style": "#icon-1899-0288D1",
    "lng": 106.6343023,
    "lat": -6.055324733,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #A70",
    "style": "#icon-1899-0288D1",
    "lng": 106.637002,
    "lat": -6.056237,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #AH71",
    "style": "#icon-1899-0288D1",
    "lng": 106.6382349,
    "lat": -6.058629076,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #D72",
    "style": "#icon-1899-0288D1",
    "lng": 106.6369735,
    "lat": -6.060977936,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #AH73",
    "style": "#icon-1899-0288D1",
    "lng": 106.6357239,
    "lat": -6.063337887,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TLKGA #EA74",
    "style": "#icon-1899-0288D1",
    "lng": 106.6358014,
    "lat": -6.064028353,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D1",
    "style": "#icon-1899-0288D1",
    "lng": 106.47415,
    "lat": -6.07056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D2",
    "style": "#icon-1899-0288D1",
    "lng": 106.47572,
    "lat": -6.07235,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D3",
    "style": "#icon-1899-0288D1",
    "lng": 106.47781,
    "lat": -6.0745,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D4",
    "style": "#icon-1899-0288D1",
    "lng": 106.4799529,
    "lat": -6.076517107,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A5",
    "style": "#icon-1899-0288D1",
    "lng": 106.48189,
    "lat": -6.0786,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D6",
    "style": "#icon-1899-0288D1",
    "lng": 106.4843,
    "lat": -6.07976,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D7",
    "style": "#icon-1899-0288D1",
    "lng": 106.4870122,
    "lat": -6.08119945,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D8",
    "style": "#icon-1899-0288D1",
    "lng": 106.48989,
    "lat": -6.082647932,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D9",
    "style": "#icon-1899-0288D1",
    "lng": 106.49194,
    "lat": -6.08359,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D10",
    "style": "#icon-1899-0288D1",
    "lng": 106.4942599,
    "lat": -6.08487339,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D11",
    "style": "#icon-1899-0288D1",
    "lng": 106.49672,
    "lat": -6.08614,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D12",
    "style": "#icon-1899-0288D1",
    "lng": 106.49931,
    "lat": -6.08733,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.50149,
    "lat": -6.0884,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A14",
    "style": "#icon-1899-0288D1",
    "lng": 106.50417,
    "lat": -6.08986,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.50654,
    "lat": -6.09069,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D16",
    "style": "#icon-1899-0288D1",
    "lng": 106.50954,
    "lat": -6.09166,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D17",
    "style": "#icon-1899-0288D1",
    "lng": 106.5120912,
    "lat": -6.092498521,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D18",
    "style": "#icon-1899-0288D1",
    "lng": 106.5146495,
    "lat": -6.093384857,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A19",
    "style": "#icon-1899-0288D1",
    "lng": 106.5169111,
    "lat": -6.094223721,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A20",
    "style": "#icon-1899-0288D1",
    "lng": 106.51809,
    "lat": -6.09473,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #AH21",
    "style": "#icon-1899-0288D1",
    "lng": 106.5209927,
    "lat": -6.095550507,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D22",
    "style": "#icon-1899-0288D1",
    "lng": 106.5217593,
    "lat": -6.0984338,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D23",
    "style": "#icon-1899-0288D1",
    "lng": 106.52249,
    "lat": -6.10153,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D24",
    "style": "#icon-1899-0288D1",
    "lng": 106.5232181,
    "lat": -6.104185867,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D25",
    "style": "#icon-1899-0288D1",
    "lng": 106.523919,
    "lat": -6.10692497,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D26",
    "style": "#icon-1899-0288D1",
    "lng": 106.52448,
    "lat": -6.10926,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D27",
    "style": "#icon-1899-0288D1",
    "lng": 106.52531,
    "lat": -6.1122,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D28",
    "style": "#icon-1899-0288D1",
    "lng": 106.5260451,
    "lat": -6.115331715,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A29",
    "style": "#icon-1899-0288D1",
    "lng": 106.52675,
    "lat": -6.11797,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D30",
    "style": "#icon-1899-0288D1",
    "lng": 106.5274612,
    "lat": -6.120770286,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D31",
    "style": "#icon-1899-0288D1",
    "lng": 106.5281858,
    "lat": -6.123621883,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A32",
    "style": "#icon-1899-0288D1",
    "lng": 106.5287256,
    "lat": -6.125914526,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A33",
    "style": "#icon-1899-0288D1",
    "lng": 106.52965,
    "lat": -6.12698,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #AH34",
    "style": "#icon-1899-0288D1",
    "lng": 106.52965,
    "lat": -6.12865,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A35",
    "style": "#icon-1899-0288D1",
    "lng": 106.5313062,
    "lat": -6.1295673,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A36",
    "style": "#icon-1899-0288D1",
    "lng": 106.5324524,
    "lat": -6.129154061,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D37",
    "style": "#icon-1899-0288D1",
    "lng": 106.5343079,
    "lat": -6.128683518,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D38",
    "style": "#icon-1899-0288D1",
    "lng": 106.5364576,
    "lat": -6.128062851,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A39",
    "style": "#icon-1899-0288D1",
    "lng": 106.5397334,
    "lat": -6.128247633,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D40",
    "style": "#icon-1899-0288D1",
    "lng": 106.5417168,
    "lat": -6.129169364,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D41",
    "style": "#icon-1899-0288D1",
    "lng": 106.5439,
    "lat": -6.13027,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A42",
    "style": "#icon-1899-0288D1",
    "lng": 106.54598,
    "lat": -6.13131,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D43",
    "style": "#icon-1899-0288D1",
    "lng": 106.54761,
    "lat": -6.13397,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D44",
    "style": "#icon-1899-0288D1",
    "lng": 106.54926,
    "lat": -6.13667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A45",
    "style": "#icon-1899-0288D1",
    "lng": 106.5505,
    "lat": -6.13876,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D46",
    "style": "#icon-1899-0288D1",
    "lng": 106.5535,
    "lat": -6.1399,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D47",
    "style": "#icon-1899-0288D1",
    "lng": 106.55619,
    "lat": -6.14097,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #AH48",
    "style": "#icon-1899-0288D1",
    "lng": 106.5587102,
    "lat": -6.141838135,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU GANTRY",
    "style": "#icon-1899-0288D1",
    "lng": 106.5591186,
    "lat": -6.142187832,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D49",
    "style": "#icon-1899-0288D1",
    "lng": 106.5593878,
    "lat": -6.142694084,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D50",
    "style": "#icon-1899-0288D1",
    "lng": 106.5607976,
    "lat": -6.142905395,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D51",
    "style": "#icon-1899-0288D1",
    "lng": 106.5634786,
    "lat": -6.143364089,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D52",
    "style": "#icon-1899-0288D1",
    "lng": 106.5667315,
    "lat": -6.143230853,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A53",
    "style": "#icon-1899-0288D1",
    "lng": 106.56991,
    "lat": -6.14308,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A54",
    "style": "#icon-1899-0288D1",
    "lng": 106.5735589,
    "lat": -6.142963412,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A55",
    "style": "#icon-1899-0288D1",
    "lng": 106.5756805,
    "lat": -6.144901909,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D56",
    "style": "#icon-1899-0288D1",
    "lng": 106.5769496,
    "lat": -6.146083362,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D57",
    "style": "#icon-1899-0288D1",
    "lng": 106.5780298,
    "lat": -6.147618748,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D58",
    "style": "#icon-1899-0288D1",
    "lng": 106.5799276,
    "lat": -6.147808092,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D59",
    "style": "#icon-1899-0288D1",
    "lng": 106.58174,
    "lat": -6.14793,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D60",
    "style": "#icon-1899-0288D1",
    "lng": 106.583498,
    "lat": -6.148097317,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D61",
    "style": "#icon-1899-0288D1",
    "lng": 106.58511,
    "lat": -6.1482,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D62",
    "style": "#icon-1899-0288D1",
    "lng": 106.58635,
    "lat": -6.14834,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D63",
    "style": "#icon-1899-0288D1",
    "lng": 106.5880019,
    "lat": -6.148447534,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D64",
    "style": "#icon-1899-0288D1",
    "lng": 106.5892556,
    "lat": -6.1485245,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A65",
    "style": "#icon-1899-0288D1",
    "lng": 106.59053,
    "lat": -6.14867,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #AH66",
    "style": "#icon-1899-0288D1",
    "lng": 106.5917069,
    "lat": -6.148355799,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D67",
    "style": "#icon-1899-0288D1",
    "lng": 106.5928548,
    "lat": -6.148525841,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D68",
    "style": "#icon-1899-0288D1",
    "lng": 106.5939142,
    "lat": -6.148556173,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D69",
    "style": "#icon-1899-0288D1",
    "lng": 106.59475,
    "lat": -6.14858,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D70",
    "style": "#icon-1899-0288D1",
    "lng": 106.5957002,
    "lat": -6.148675786,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D71",
    "style": "#icon-1899-0288D1",
    "lng": 106.59672,
    "lat": -6.1488,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D72",
    "style": "#icon-1899-0288D1",
    "lng": 106.5975931,
    "lat": -6.148887031,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D73",
    "style": "#icon-1899-0288D1",
    "lng": 106.5984106,
    "lat": -6.148962709,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D74",
    "style": "#icon-1899-0288D1",
    "lng": 106.5994293,
    "lat": -6.14906564,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A75",
    "style": "#icon-1899-0288D1",
    "lng": 106.60034,
    "lat": -6.14923,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #A76",
    "style": "#icon-1899-0288D1",
    "lng": 106.6012888,
    "lat": -6.149692245,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D77",
    "style": "#icon-1899-0288D1",
    "lng": 106.6023194,
    "lat": -6.150615237,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D78",
    "style": "#icon-1899-0288D1",
    "lng": 106.6028419,
    "lat": -6.151106274,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D79",
    "style": "#icon-1899-0288D1",
    "lng": 106.6035666,
    "lat": -6.151843176,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D80",
    "style": "#icon-1899-0288D1",
    "lng": 106.6042824,
    "lat": -6.152623874,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D81",
    "style": "#icon-1899-0288D1",
    "lng": 106.60477,
    "lat": -6.15314,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D82",
    "style": "#icon-1899-0288D1",
    "lng": 106.6053287,
    "lat": -6.153700985,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #D83",
    "style": "#icon-1899-0288D1",
    "lng": 106.60583,
    "lat": -6.15421,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #AH84",
    "style": "#icon-1899-0288D1",
    "lng": 106.60622,
    "lat": -6.15466,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-TGBRU #EA85",
    "style": "#icon-1899-0288D1",
    "lng": 106.606115,
    "lat": -6.155624,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #EA13A",
    "style": "#icon-1899-0288D1",
    "lng": 106.559692,
    "lat": -6.141745,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.5587612,
    "lat": -6.142570428,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D14",
    "style": "#icon-1899-0288D1",
    "lng": 106.5568145,
    "lat": -6.144460316,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.55448,
    "lat": -6.1468,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D16",
    "style": "#icon-1899-0288D1",
    "lng": 106.5528985,
    "lat": -6.148293196,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D17",
    "style": "#icon-1899-0288D1",
    "lng": 106.5514843,
    "lat": -6.149756119,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D18",
    "style": "#icon-1899-0288D1",
    "lng": 106.5493469,
    "lat": -6.151824522,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D19",
    "style": "#icon-1899-0288D1",
    "lng": 106.5473053,
    "lat": -6.153838722,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D20",
    "style": "#icon-1899-0288D1",
    "lng": 106.5453262,
    "lat": -6.155715754,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D21",
    "style": "#icon-1899-0288D1",
    "lng": 106.5434445,
    "lat": -6.157560313,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #AH22",
    "style": "#icon-1899-0288D1",
    "lng": 106.54158,
    "lat": -6.15947,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #A23",
    "style": "#icon-1899-0288D1",
    "lng": 106.538725,
    "lat": -6.160599564,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #AH24",
    "style": "#icon-1899-0288D1",
    "lng": 106.53563,
    "lat": -6.1606,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #A25",
    "style": "#icon-1899-0288D1",
    "lng": 106.5331739,
    "lat": -6.16202961,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D26",
    "style": "#icon-1899-0288D1",
    "lng": 106.53063,
    "lat": -6.16233,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D27",
    "style": "#icon-1899-0288D1",
    "lng": 106.5283171,
    "lat": -6.162578648,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #AH28",
    "style": "#icon-1899-0288D1",
    "lng": 106.5260188,
    "lat": -6.16287482,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D29",
    "style": "#icon-1899-0288D1",
    "lng": 106.5255531,
    "lat": -6.165404381,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #D30",
    "style": "#icon-1899-0288D1",
    "lng": 106.5251585,
    "lat": -6.16716643,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #A31",
    "style": "#icon-1899-0288D1",
    "lng": 106.5249256,
    "lat": -6.169158463,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #A32",
    "style": "#icon-1899-0288D1",
    "lng": 106.5250503,
    "lat": -6.172177174,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #A33",
    "style": "#icon-1899-0288D1",
    "lng": 106.5248365,
    "lat": -6.17492234,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #A34",
    "style": "#icon-1899-0288D1",
    "lng": 106.5254862,
    "lat": -6.177871159,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #A35",
    "style": "#icon-1899-0288D1",
    "lng": 106.527428,
    "lat": -6.180666105,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PSKBR-PSKMS #EA36",
    "style": "#icon-1899-0288D1",
    "lng": 106.5293314,
    "lat": -6.182709043,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A1",
    "style": "#icon-1899-0288D1",
    "lng": 106.7269444,
    "lat": -6.1689167,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7272778,
    "lat": -6.1679444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7270278,
    "lat": -6.1662778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D4",
    "style": "#icon-1899-0288D1",
    "lng": 106.726943,
    "lat": -6.164366292,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7269166,
    "lat": -6.162545971,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D6",
    "style": "#icon-1899-0288D1",
    "lng": 106.7268889,
    "lat": -6.1608333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A7",
    "style": "#icon-1899-0288D1",
    "lng": 106.7269444,
    "lat": -6.1595,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A8",
    "style": "#icon-1899-0288D1",
    "lng": 106.7268611,
    "lat": -6.1580833,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A9",
    "style": "#icon-1899-0288D1",
    "lng": 106.7278056,
    "lat": -6.157,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #AH10",
    "style": "#icon-1899-0288D1",
    "lng": 106.7279722,
    "lat": -6.1553056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A11",
    "style": "#icon-1899-0288D1",
    "lng": 106.7288889,
    "lat": -6.1546944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A12",
    "style": "#icon-1899-0288D1",
    "lng": 106.7303333,
    "lat": -6.1551111,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A13",
    "style": "#icon-1899-0288D1",
    "lng": 106.7320556,
    "lat": -6.1551667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A14",
    "style": "#icon-1899-0288D1",
    "lng": 106.73375,
    "lat": -6.1548889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A15",
    "style": "#icon-1899-0288D1",
    "lng": 106.7354722,
    "lat": -6.1548333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A16",
    "style": "#icon-1899-0288D1",
    "lng": 106.7371667,
    "lat": -6.1548333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A17",
    "style": "#icon-1899-0288D1",
    "lng": 106.7387222,
    "lat": -6.1548333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A18",
    "style": "#icon-1899-0288D1",
    "lng": 106.74025,
    "lat": -6.1548889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A19",
    "style": "#icon-1899-0288D1",
    "lng": 106.7420278,
    "lat": -6.1549722,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D20",
    "style": "#icon-1899-0288D1",
    "lng": 106.74367,
    "lat": -6.15507,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D21",
    "style": "#icon-1899-0288D1",
    "lng": 106.7454508,
    "lat": -6.155308486,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D22",
    "style": "#icon-1899-0288D1",
    "lng": 106.7471944,
    "lat": -6.1555,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D23",
    "style": "#icon-1899-0288D1",
    "lng": 106.7488333,
    "lat": -6.1556667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A24",
    "style": "#icon-1899-0288D1",
    "lng": 106.7506111,
    "lat": -6.1558333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A25",
    "style": "#icon-1899-0288D1",
    "lng": 106.7521944,
    "lat": -6.1560833,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A26",
    "style": "#icon-1899-0288D1",
    "lng": 106.754,
    "lat": -6.1562778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D27",
    "style": "#icon-1899-0288D1",
    "lng": 106.7555278,
    "lat": -6.1567222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A28",
    "style": "#icon-1899-0288D1",
    "lng": 106.7572778,
    "lat": -6.1571667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #D29",
    "style": "#icon-1899-0288D1",
    "lng": 106.7588889,
    "lat": -6.1576944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A30",
    "style": "#icon-1899-0288D1",
    "lng": 106.7606111,
    "lat": -6.15825,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A31",
    "style": "#icon-1899-0288D1",
    "lng": 106.7621111,
    "lat": -6.1586667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A32",
    "style": "#icon-1899-0288D1",
    "lng": 106.7634722,
    "lat": -6.1586389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A33",
    "style": "#icon-1899-0288D1",
    "lng": 106.7647222,
    "lat": -6.1591944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A34",
    "style": "#icon-1899-0288D1",
    "lng": 106.7665278,
    "lat": -6.1602222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #A35",
    "style": "#icon-1899-0288D1",
    "lng": 106.7668889,
    "lat": -6.1621389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A36",
    "style": "#icon-1899-0288D1",
    "lng": 106.7680556,
    "lat": -6.1633889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A37",
    "style": "#icon-1899-0288D1",
    "lng": 106.7698056,
    "lat": -6.16375,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL#A38",
    "style": "#icon-1899-0288D1",
    "lng": 106.7715,
    "lat": -6.1643056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A39",
    "style": "#icon-1899-0288D1",
    "lng": 106.7730833,
    "lat": -6.1651944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A40",
    "style": "#icon-1899-0288D1",
    "lng": 106.7749722,
    "lat": -6.1655833,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A41",
    "style": "#icon-1899-0288D1",
    "lng": 106.7766111,
    "lat": -6.1664722,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A42",
    "style": "#icon-1899-0288D1",
    "lng": 106.778368,
    "lat": -6.166581709,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A43",
    "style": "#icon-1899-0288D1",
    "lng": 106.7799444,
    "lat": -6.166,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A44",
    "style": "#icon-1899-0288D1",
    "lng": 106.7809456,
    "lat": -6.16599563,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #A45",
    "style": "#icon-1899-0288D1",
    "lng": 106.7822283,
    "lat": -6.166419255,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GRLBR-GRGOL #EA46",
    "style": "#icon-1899-0288D1",
    "lng": 106.7836389,
    "lat": -6.1667778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR #EA0",
    "style": "#icon-1899-0288D1",
    "lng": 106.7261944,
    "lat": -6.1691667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #DH9",
    "style": "#icon-1899-0288D1",
    "lng": 106.7317598,
    "lat": -6.193387415,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D10",
    "style": "#icon-1899-0288D1",
    "lng": 106.7329722,
    "lat": -6.1956389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D11",
    "style": "#icon-1899-0288D1",
    "lng": 106.7342222,
    "lat": -6.1983889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D12",
    "style": "#icon-1899-0288D1",
    "lng": 106.7354444,
    "lat": -6.2007778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.7369444,
    "lat": -6.2034444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #DH14",
    "style": "#icon-1899-0288D1",
    "lng": 106.7380833,
    "lat": -6.2060833,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.7392222,
    "lat": -6.2088889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D16",
    "style": "#icon-1899-0288D1",
    "lng": 106.7403333,
    "lat": -6.2116111,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D17",
    "style": "#icon-1899-0288D1",
    "lng": 106.7414167,
    "lat": -6.2143333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D18",
    "style": "#icon-1899-0288D1",
    "lng": 106.7423333,
    "lat": -6.2167778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D19",
    "style": "#icon-1899-0288D1",
    "lng": 106.7433889,
    "lat": -6.2191667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #DH20",
    "style": "#icon-1899-0288D1",
    "lng": 106.7443333,
    "lat": -6.2215278,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D21",
    "style": "#icon-1899-0288D1",
    "lng": 106.7441111,
    "lat": -6.2245278,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D22",
    "style": "#icon-1899-0288D1",
    "lng": 106.7439167,
    "lat": -6.2274444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D23",
    "style": "#icon-1899-0288D1",
    "lng": 106.7435124,
    "lat": -6.23024162,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D24",
    "style": "#icon-1899-0288D1",
    "lng": 106.7434722,
    "lat": -6.2329444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D25",
    "style": "#icon-1899-0288D1",
    "lng": 106.7432778,
    "lat": -6.2358611,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D26",
    "style": "#icon-1899-0288D1",
    "lng": 106.7431111,
    "lat": -6.2383056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D27",
    "style": "#icon-1899-0288D1",
    "lng": 106.7428889,
    "lat": -6.2413056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D28",
    "style": "#icon-1899-0288D1",
    "lng": 106.7426944,
    "lat": -6.2438611,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D29",
    "style": "#icon-1899-0288D1",
    "lng": 106.7424444,
    "lat": -6.2470556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #D30",
    "style": "#icon-1899-0288D1",
    "lng": 106.7422778,
    "lat": -6.2496111,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #AH31",
    "style": "#icon-1899-0288D1",
    "lng": 106.7419444,
    "lat": -6.2523611,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG #EA32",
    "style": "#icon-1899-0288D1",
    "lng": 106.7425833,
    "lat": -6.2525278,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #SP01A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7873705,
    "lat": -6.112091144,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #SP01B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7875132,
    "lat": -6.112103637,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #SP02",
    "style": "#icon-1899-0288D1",
    "lng": 106.7870806,
    "lat": -6.112124464,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #SP03",
    "style": "#icon-1899-0288D1",
    "lng": 106.7866134,
    "lat": -6.112128779,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #SP04",
    "style": "#icon-1899-0288D1",
    "lng": 106.7859343,
    "lat": -6.112141567,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #SP05",
    "style": "#icon-1899-0288D1",
    "lng": 106.7853068,
    "lat": -6.112149628,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #AH1",
    "style": "#icon-1899-0288D1",
    "lng": 106.7846111,
    "lat": -6.1122222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #D2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7841944,
    "lat": -6.1147222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #D3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7838611,
    "lat": -6.1172222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #A4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7835,
    "lat": -6.1201389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #D5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7835306,
    "lat": -6.122942689,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #A6",
    "style": "#icon-1899-0288D1",
    "lng": 106.7835,
    "lat": -6.12575,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #A7",
    "style": "#icon-1899-0288D1",
    "lng": 106.7840278,
    "lat": -6.1283333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #AH8",
    "style": "#icon-1899-0288D1",
    "lng": 106.7848056,
    "lat": -6.1310556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #D9",
    "style": "#icon-1899-0288D1",
    "lng": 106.7874722,
    "lat": -6.1315556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #AH10",
    "style": "#icon-1899-0288D1",
    "lng": 106.7898611,
    "lat": -6.1320278,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #AH11",
    "style": "#icon-1899-0288D1",
    "lng": 106.7906667,
    "lat": -6.1327222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKLMA-ANGKE #EA12",
    "style": "#icon-1899-0288D1",
    "lng": 106.7908611,
    "lat": -6.13375,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7812286,
    "lat": -6.110606,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7796425,
    "lat": -6.1099734,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7788462,
    "lat": -6.1096418,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7781622,
    "lat": -6.1093839,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7768485,
    "lat": -6.1089873,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7740833,
    "lat": -6.1079167,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7713889,
    "lat": -6.1069167,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D6",
    "style": "#icon-1899-0288D1",
    "lng": 106.7686944,
    "lat": -6.1059167,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D7",
    "style": "#icon-1899-0288D1",
    "lng": 106.7657611,
    "lat": -6.105959395,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D8",
    "style": "#icon-1899-0288D1",
    "lng": 106.7631944,
    "lat": -6.1073611,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D9",
    "style": "#icon-1899-0288D1",
    "lng": 106.7608611,
    "lat": -6.1087222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D10",
    "style": "#icon-1899-0288D1",
    "lng": 106.7584444,
    "lat": -6.1100556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D11",
    "style": "#icon-1899-0288D1",
    "lng": 106.7560278,
    "lat": -6.1113889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D12",
    "style": "#icon-1899-0288D1",
    "lng": 106.7535,
    "lat": -6.11275,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #AH13",
    "style": "#icon-1899-0288D1",
    "lng": 106.7508889,
    "lat": -6.1142778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D14",
    "style": "#icon-1899-0288D1",
    "lng": 106.7511389,
    "lat": -6.1171944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.7513889,
    "lat": -6.1200833,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #A16",
    "style": "#icon-1899-0288D1",
    "lng": 106.7516944,
    "lat": -6.1229444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKBRU-PINKA #EAH16A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7514769,
    "lat": -6.123768101,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #EAH16B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7514924,
    "lat": -6.1240623,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #A17",
    "style": "#icon-1899-0288D1",
    "lng": 106.7519375,
    "lat": -6.125761184,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D18",
    "style": "#icon-1899-0288D1",
    "lng": 106.7521667,
    "lat": -6.1285833,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D19",
    "style": "#icon-1899-0288D1",
    "lng": 106.7524197,
    "lat": -6.131407344,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D20",
    "style": "#icon-1899-0288D1",
    "lng": 106.7519167,
    "lat": -6.1341389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D21",
    "style": "#icon-1899-0288D1",
    "lng": 106.7501667,
    "lat": -6.1363889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D22",
    "style": "#icon-1899-0288D1",
    "lng": 106.7483056,
    "lat": -6.13875,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D23",
    "style": "#icon-1899-0288D1",
    "lng": 106.7465278,
    "lat": -6.1409444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D24",
    "style": "#icon-1899-0288D1",
    "lng": 106.7446111,
    "lat": -6.1433333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D25",
    "style": "#icon-1899-0288D1",
    "lng": 106.7428056,
    "lat": -6.1456389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #D26",
    "style": "#icon-1899-0288D1",
    "lng": 106.7410556,
    "lat": -6.1478333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV PINKA-DNMGT #EA27A",
    "style": "#icon-1899-0288D1",
    "lng": 106.73927,
    "lat": -6.150063,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #EA27B",
    "style": "#icon-1899-0288D1",
    "lng": 106.738535,
    "lat": -6.151023,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #D28",
    "style": "#icon-1899-0288D1",
    "lng": 106.7374444,
    "lat": -6.1523889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #A28A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7365278,
    "lat": -6.1542778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #A29",
    "style": "#icon-1899-0288D1",
    "lng": 106.7358889,
    "lat": -6.1553333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #D30",
    "style": "#icon-1899-0288D1",
    "lng": 106.7347222,
    "lat": -6.1575833,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #D31",
    "style": "#icon-1899-0288D1",
    "lng": 106.7334167,
    "lat": -6.1603611,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #D32",
    "style": "#icon-1899-0288D1",
    "lng": 106.7321667,
    "lat": -6.1628333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #D33",
    "style": "#icon-1899-0288D1",
    "lng": 106.7311111,
    "lat": -6.1653056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #D34",
    "style": "#icon-1899-0288D1",
    "lng": 106.7298611,
    "lat": -6.1679167,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #AH35",
    "style": "#icon-1899-0288D1",
    "lng": 106.7287778,
    "lat": -6.1696944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DNMGT-DKSBI #EA36",
    "style": "#icon-1899-0288D1",
    "lng": 106.7263611,
    "lat": -6.16975,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #SP01",
    "style": "#icon-1899-0288D1",
    "lng": 106.7872788,
    "lat": -6.112001523,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #SP02",
    "style": "#icon-1899-0288D1",
    "lng": 106.7870673,
    "lat": -6.112020077,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #SP03",
    "style": "#icon-1899-0288D1",
    "lng": 106.7866091,
    "lat": -6.112050045,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #SP04",
    "style": "#icon-1899-0288D1",
    "lng": 106.7859322,
    "lat": -6.112059066,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #SP05",
    "style": "#icon-1899-0288D1",
    "lng": 106.7853079,
    "lat": -6.112052922,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #AH1",
    "style": "#icon-1899-0288D1",
    "lng": 106.7845833,
    "lat": -6.1121111,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #AH1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7836918,
    "lat": -6.112145958,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #A2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7823985,
    "lat": -6.111365,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D3 (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7795376,
    "lat": -6.1102862,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D3A  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7787194,
    "lat": -6.1099438,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D3B  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7780565,
    "lat": -6.1096414,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D4  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7767607,
    "lat": -6.1092215,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D5  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7739444,
    "lat": -6.1082222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D6  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7713056,
    "lat": -6.1073611,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D7  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7686667,
    "lat": -6.1062222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D8  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7658721,
    "lat": -6.1062964,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D9  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7633333,
    "lat": -6.1076667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D10  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7609722,
    "lat": -6.109,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D11  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7585556,
    "lat": -6.1103056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D12  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7561111,
    "lat": -6.1116389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D13  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7536667,
    "lat": -6.1129722,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #AH14  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7511944,
    "lat": -6.1144444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D15  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7514722,
    "lat": -6.1171944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D16  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7517222,
    "lat": -6.1200833,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D17  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7519722,
    "lat": -6.1229444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D18  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7522218,
    "lat": -6.1257904,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D19  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7524893,
    "lat": -6.1285893,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D20  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7527373,
    "lat": -6.1314134,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D21  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.75225,
    "lat": -6.1342222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D22  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7504167,
    "lat": -6.1365556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D23  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7486111,
    "lat": -6.1388889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D24  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7467778,
    "lat": -6.1411667,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D25  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7449444,
    "lat": -6.1435,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D26  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7431111,
    "lat": -6.1458056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D27  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7413333,
    "lat": -6.1480556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D28  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7395556,
    "lat": -6.1501944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #A29  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7378056,
    "lat": -6.1524722,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #A29A  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7366389,
    "lat": -6.15425,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #A30  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.736,
    "lat": -6.1553611,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D31  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7349722,
    "lat": -6.1576944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D32  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7337222,
    "lat": -6.1605556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D33  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7324167,
    "lat": -6.1629444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D34  (Sudah dirubuhkan)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7313333,
    "lat": -6.1654722,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #D35",
    "style": "#icon-1899-0288D1",
    "lng": 106.7301111,
    "lat": -6.1680556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #AH36",
    "style": "#icon-1899-0288D1",
    "lng": 106.7290833,
    "lat": -6.1699167,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #A37",
    "style": "#icon-1899-0288D1",
    "lng": 106.7284466,
    "lat": -6.170466551,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV MKRNG-DKSBI #EAH38",
    "style": "#icon-1899-0288D1",
    "lng": 106.7264631,
    "lat": -6.171409713,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #EA1",
    "style": "#icon-1899-0288D1",
    "lng": 106.6587826,
    "lat": -6.1517572,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A2",
    "style": "#icon-1899-0288D1",
    "lng": 106.6577778,
    "lat": -6.1531944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A3",
    "style": "#icon-1899-0288D1",
    "lng": 106.6563056,
    "lat": -6.1539167,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D4",
    "style": "#icon-1899-0288D1",
    "lng": 106.6545556,
    "lat": -6.1541389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D5",
    "style": "#icon-1899-0288D1",
    "lng": 106.6529444,
    "lat": -6.1543333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D6",
    "style": "#icon-1899-0288D1",
    "lng": 106.6512222,
    "lat": -6.1545,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A7",
    "style": "#icon-1899-0288D1",
    "lng": 106.6495278,
    "lat": -6.1546944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A8",
    "style": "#icon-1899-0288D1",
    "lng": 106.648,
    "lat": -6.15475,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D9",
    "style": "#icon-1899-0288D1",
    "lng": 106.6462778,
    "lat": -6.15475,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D10",
    "style": "#icon-1899-0288D1",
    "lng": 106.6445833,
    "lat": -6.1547222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D11",
    "style": "#icon-1899-0288D1",
    "lng": 106.6429167,
    "lat": -6.1547222,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A12",
    "style": "#icon-1899-0288D1",
    "lng": 106.6411944,
    "lat": -6.1546944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.6394123,
    "lat": -6.155201921,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D14",
    "style": "#icon-1899-0288D1",
    "lng": 106.6380149,
    "lat": -6.155929724,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.6366667,
    "lat": -6.1566389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D16",
    "style": "#icon-1899-0288D1",
    "lng": 106.6354444,
    "lat": -6.1575556,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D17",
    "style": "#icon-1899-0288D1",
    "lng": 106.6338179,
    "lat": -6.158287014,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A18",
    "style": "#icon-1899-0288D1",
    "lng": 106.6321797,
    "lat": -6.159486918,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A19",
    "style": "#icon-1899-0288D1",
    "lng": 106.6294444,
    "lat": -6.1606111,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A20",
    "style": "#icon-1899-0288D1",
    "lng": 106.6278056,
    "lat": -6.161,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A21",
    "style": "#icon-1899-0288D1",
    "lng": 106.6261629,
    "lat": -6.161168362,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D22",
    "style": "#icon-1899-0288D1",
    "lng": 106.6243333,
    "lat": -6.1607778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A23",
    "style": "#icon-1899-0288D1",
    "lng": 106.6226389,
    "lat": -6.1605278,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A24",
    "style": "#icon-1899-0288D1",
    "lng": 106.6208889,
    "lat": -6.1604722,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D25",
    "style": "#icon-1899-0288D1",
    "lng": 106.6191389,
    "lat": -6.1606389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D26",
    "style": "#icon-1899-0288D1",
    "lng": 106.6173889,
    "lat": -6.1608056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A27",
    "style": "#icon-1899-0288D1",
    "lng": 106.6156944,
    "lat": -6.1609722,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A28",
    "style": "#icon-1899-0288D1",
    "lng": 106.6139722,
    "lat": -6.1605,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A29",
    "style": "#icon-1899-0288D1",
    "lng": 106.6128889,
    "lat": -6.1593056,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #D30",
    "style": "#icon-1899-0288D1",
    "lng": 106.6115278,
    "lat": -6.1586389,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A31",
    "style": "#icon-1899-0288D1",
    "lng": 106.61025,
    "lat": -6.1579444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A32",
    "style": "#icon-1899-0288D1",
    "lng": 106.6091667,
    "lat": -6.1569444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #A33",
    "style": "#icon-1899-0288D1",
    "lng": 106.6080556,
    "lat": -6.1557778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV CKRBR-TGBRU #EA34",
    "style": "#icon-1899-0288D1",
    "lng": 106.6067778,
    "lat": -6.1558333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CGKRG #EA0",
    "style": "#icon-1899-0288D1",
    "lng": 106.7253881,
    "lat": -6.170263324,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CGKRG #AH1",
    "style": "#icon-1899-0288D1",
    "lng": 106.7252533,
    "lat": -6.170890801,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CGKRG #A2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7222772,
    "lat": -6.169221411,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CGKRG #D2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7201768,
    "lat": -6.168566259,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CGKRG #D3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7186068,
    "lat": -6.168099867,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CGKRG #A4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7152881,
    "lat": -6.167149657,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #A4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7132572,
    "lat": -6.168213015,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7116057,
    "lat": -6.169143113,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D6",
    "style": "#icon-1899-0288D1",
    "lng": 106.709922,
    "lat": -6.170123666,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D7",
    "style": "#icon-1899-0288D1",
    "lng": 106.7080886,
    "lat": -6.171328852,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D8",
    "style": "#icon-1899-0288D1",
    "lng": 106.7063629,
    "lat": -6.172058232,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D9",
    "style": "#icon-1899-0288D1",
    "lng": 106.7045615,
    "lat": -6.173423555,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D10",
    "style": "#icon-1899-0288D1",
    "lng": 106.70279,
    "lat": -6.174501372,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D11",
    "style": "#icon-1899-0288D1",
    "lng": 106.7008611,
    "lat": -6.1757778,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D12",
    "style": "#icon-1899-0288D1",
    "lng": 106.6990979,
    "lat": -6.176666507,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.6973876,
    "lat": -6.177748571,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D14",
    "style": "#icon-1899-0288D1",
    "lng": 106.6940384,
    "lat": -6.179738835,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.6908631,
    "lat": -6.181608084,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D16",
    "style": "#icon-1899-0288D1",
    "lng": 106.6889226,
    "lat": -6.182791738,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D17",
    "style": "#icon-1899-0288D1",
    "lng": 106.6865807,
    "lat": -6.1841946,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D18",
    "style": "#icon-1899-0288D1",
    "lng": 106.6830735,
    "lat": -6.1863038,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #D19",
    "style": "#icon-1899-0288D1",
    "lng": 106.6813721,
    "lat": -6.1873777,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #A20",
    "style": "#icon-1899-0288D1",
    "lng": 106.6796097,
    "lat": -6.1883912,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #AH21",
    "style": "#icon-1899-0288D1",
    "lng": 106.6767213,
    "lat": -6.190028312,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #A2AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6751815,
    "lat": -6.188935796,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D3AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6743573,
    "lat": -6.1873061,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D4AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6734764,
    "lat": -6.185720599,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D5AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.672609,
    "lat": -6.184119516,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D6AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6717818,
    "lat": -6.1824998,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D7AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6709751,
    "lat": -6.1809307,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D8AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6701084,
    "lat": -6.1793535,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D9AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.669277,
    "lat": -6.17768239,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D10AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6683096,
    "lat": -6.1760752,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D11AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6676107,
    "lat": -6.1746429,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D12AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.666731,
    "lat": -6.173096285,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D13AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6659989,
    "lat": -6.1717747,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D14AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6651137,
    "lat": -6.1699829,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D15AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6643122,
    "lat": -6.1685229,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D16AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6636986,
    "lat": -6.167357,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #A17AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6628843,
    "lat": -6.165814907,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #A18AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6622072,
    "lat": -6.164299564,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #A19AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6610423,
    "lat": -6.16267958,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #A20AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6598202,
    "lat": -6.160877988,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D21AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6596561,
    "lat": -6.158788853,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D22AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6595128,
    "lat": -6.156636958,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #D23AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6593608,
    "lat": -6.154199769,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-TGRLM+DKSBI-CKRNG #A24AB",
    "style": "#icon-1899-0288D1",
    "lng": 106.6592246,
    "lat": -6.152700448,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-CKRNG #EA25A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6597423,
    "lat": -6.1515201,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #EA25B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6592168,
    "lat": -6.1517137,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #EA1",
    "style": "#icon-1899-0288D1",
    "lng": 106.64161,
    "lat": -6.20677,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #A2",
    "style": "#icon-1899-0288D1",
    "lng": 106.6425634,
    "lat": -6.207153374,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D3",
    "style": "#icon-1899-0288D1",
    "lng": 106.6453056,
    "lat": -6.2075278,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #AH4",
    "style": "#icon-1899-0288D1",
    "lng": 106.6491667,
    "lat": -6.2078611,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D5",
    "style": "#icon-1899-0288D1",
    "lng": 106.6519167,
    "lat": -6.2058889,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D6",
    "style": "#icon-1899-0288D1",
    "lng": 106.6546111,
    "lat": -6.2039444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D7",
    "style": "#icon-1899-0288D1",
    "lng": 106.6570833,
    "lat": -6.2021944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D8",
    "style": "#icon-1899-0288D1",
    "lng": 106.6593611,
    "lat": -6.2005,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D9",
    "style": "#icon-1899-0288D1",
    "lng": 106.6617222,
    "lat": -6.1991111,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D10",
    "style": "#icon-1899-0288D1",
    "lng": 106.6651667,
    "lat": -6.1969444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D11",
    "style": "#icon-1899-0288D1",
    "lng": 106.6671667,
    "lat": -6.1958333,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D12",
    "style": "#icon-1899-0288D1",
    "lng": 106.6688341,
    "lat": -6.19485169,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.6723611,
    "lat": -6.19275,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV TGRNG-CKRNG #AH14",
    "style": "#icon-1899-0288D1",
    "lng": 106.6755556,
    "lat": -6.19075,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #EA1",
    "style": "#icon-1899-0288D1",
    "lng": 106.5832147,
    "lat": -6.214640078,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D2",
    "style": "#icon-1899-0288D1",
    "lng": 106.5807467,
    "lat": -6.215678809,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #AH3",
    "style": "#icon-1899-0288D1",
    "lng": 106.5783263,
    "lat": -6.216433853,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D4",
    "style": "#icon-1899-0288D1",
    "lng": 106.5772929,
    "lat": -6.218569987,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #AH5",
    "style": "#icon-1899-0288D1",
    "lng": 106.5764157,
    "lat": -6.22008873,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #AH6",
    "style": "#icon-1899-0288D1",
    "lng": 106.5772603,
    "lat": -6.220927035,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D7",
    "style": "#icon-1899-0288D1",
    "lng": 106.5792829,
    "lat": -6.22085702,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D8",
    "style": "#icon-1899-0288D1",
    "lng": 106.5823494,
    "lat": -6.220956642,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D9",
    "style": "#icon-1899-0288D1",
    "lng": 106.5853852,
    "lat": -6.220795223,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D10",
    "style": "#icon-1899-0288D1",
    "lng": 106.5888111,
    "lat": -6.220743148,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D11",
    "style": "#icon-1899-0288D1",
    "lng": 106.5922815,
    "lat": -6.220707709,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5950437,
    "lat": -6.2206248,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D13",
    "style": "#icon-1899-0288D1",
    "lng": 106.5977816,
    "lat": -6.220581961,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D14",
    "style": "#icon-1899-0288D1",
    "lng": 106.6013047,
    "lat": -6.220378002,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.6046874,
    "lat": -6.220427695,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D16",
    "style": "#icon-1899-0288D1",
    "lng": 106.606585,
    "lat": -6.220263475,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D17",
    "style": "#icon-1899-0288D1",
    "lng": 106.608321,
    "lat": -6.220227846,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D18",
    "style": "#icon-1899-0288D1",
    "lng": 106.6111148,
    "lat": -6.22038489,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D19",
    "style": "#icon-1899-0288D1",
    "lng": 106.613834,
    "lat": -6.220274592,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D20",
    "style": "#icon-1899-0288D1",
    "lng": 106.6176673,
    "lat": -6.220125492,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D21",
    "style": "#icon-1899-0288D1",
    "lng": 106.6214054,
    "lat": -6.22003119,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D22",
    "style": "#icon-1899-0288D1",
    "lng": 106.6250051,
    "lat": -6.219954007,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #A23",
    "style": "#icon-1899-0288D1",
    "lng": 106.628795,
    "lat": -6.220042234,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #A24",
    "style": "#icon-1899-0288D1",
    "lng": 106.6319423,
    "lat": -6.2190271,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #A25",
    "style": "#icon-1899-0288D1",
    "lng": 106.6337639,
    "lat": -6.218194444,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #AH26",
    "style": "#icon-1899-0288D1",
    "lng": 106.6371513,
    "lat": -6.216600579,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D27",
    "style": "#icon-1899-0288D1",
    "lng": 106.6401061,
    "lat": -6.214484,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D28",
    "style": "#icon-1899-0288D1",
    "lng": 106.6429168,
    "lat": -6.2123728,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #AH29",
    "style": "#icon-1899-0288D1",
    "lng": 106.6437006,
    "lat": -6.2118225,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #D30",
    "style": "#icon-1899-0288D1",
    "lng": 106.6431657,
    "lat": -6.2099634,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #AH31",
    "style": "#icon-1899-0288D1",
    "lng": 106.6424732,
    "lat": -6.207374045,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV JTAKE-TGRNG #EA32",
    "style": "#icon-1899-0288D1",
    "lng": 106.6418054,
    "lat": -6.207055734,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-CLDUG+KMBNG-CURUG #0020A (TIDAK OPERASI)",
    "style": "#icon-1899-0288D1",
    "lng": 106.68017,
    "lat": -6.212146,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-CURUG+ALSTA-CKUPA #D47 (TIDAK OPERASI)",
    "style": "#icon-1899-0288D1",
    "lng": 106.6301195,
    "lat": -6.237919651,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-CURUG+CURUG-CKUPA #EA55A (TIDAK OPERASI)",
    "style": "#icon-1899-0288D1",
    "lng": 106.609556,
    "lat": -6.242376,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-CURUG+CURUG-CKUPA #AH55B (TIDAK OPERASI)",
    "style": "#icon-1899-0288D1",
    "lng": 106.61077,
    "lat": -6.243914,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-CURUG+CURUG-CKUPA #A55C (TIDAK OPERASI)",
    "style": "#icon-1899-0288D1",
    "lng": 106.611714,
    "lat": -6.247054,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-CURUG+ALSTA-CKUPA #EA31B (TIDAK OPERASI)",
    "style": "#icon-1899-0288D1",
    "lng": 106.656047,
    "lat": -6.220039,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-CURUG+CLDUG-ALSTA #EA31A (TIDAK OPERASI)",
    "style": "#icon-1899-0288D1",
    "lng": 106.656208,
    "lat": -6.219894,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV ALSTA-CKUPA+CURUG-CKUPA #D56 (TIDAK OPERASI)",
    "style": "#icon-1899-0288D1",
    "lng": 106.6116562,
    "lat": -6.247107037,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV KMBNG-PTKNG TX9",
    "style": "#icon-1899-0288D1",
    "lng": 106.7310592,
    "lat": -6.1922835,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DKSBI-GRLBR+GRLBR-GRGOL #EA35A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7671516,
    "lat": -6.1633085,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A1",
    "style": "#icon-1899-0288D1",
    "lng": 106.4644627,
    "lat": -6.0605261,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D2",
    "style": "#icon-1899-0288D1",
    "lng": 106.4674765,
    "lat": -6.0618292,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A3",
    "style": "#icon-1899-0288D1",
    "lng": 106.4712132,
    "lat": -6.0635513,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A4",
    "style": "#icon-1899-0288D1",
    "lng": 106.47033,
    "lat": -6.0660608,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A5",
    "style": "#icon-1899-0288D1",
    "lng": 106.4701429,
    "lat": -6.0673211,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.4702519,
    "lat": -6.0666057,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.4702293,
    "lat": -6.0668224,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D6",
    "style": "#icon-1899-0288D1",
    "lng": 106.472507,
    "lat": -6.0697648,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D7",
    "style": "#icon-1899-0288D1",
    "lng": 106.4745975,
    "lat": -6.0718274,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D8",
    "style": "#icon-1899-0288D1",
    "lng": 106.4769291,
    "lat": -6.0739966,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A9",
    "style": "#icon-1899-0288D1",
    "lng": 106.4779258,
    "lat": -6.0749153,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D10",
    "style": "#icon-1899-0288D1",
    "lng": 106.4800256,
    "lat": -6.0770362,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A11",
    "style": "#icon-1899-0288D1",
    "lng": 106.4817932,
    "lat": -6.0789116,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D12",
    "style": "#icon-1899-0288D1",
    "lng": 106.4843274,
    "lat": -6.0801846,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A13",
    "style": "#icon-1899-0288D1",
    "lng": 106.4869036,
    "lat": -6.0814194,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A14",
    "style": "#icon-1899-0288D1",
    "lng": 106.4891822,
    "lat": -6.0836835,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D15",
    "style": "#icon-1899-0288D1",
    "lng": 106.4895175,
    "lat": -6.08682,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A16",
    "style": "#icon-1899-0288D1",
    "lng": 106.4898225,
    "lat": -6.0899944,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A17",
    "style": "#icon-1899-0288D1",
    "lng": 106.491258379877,
    "lat": -6.09258402198437,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A18",
    "style": "#icon-1899-0288D1",
    "lng": 106.493171156765,
    "lat": -6.09493902103441,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A19",
    "style": "#icon-1899-0288D1",
    "lng": 106.4932208,
    "lat": -6.0978246,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A20",
    "style": "#icon-1899-0288D1",
    "lng": 106.4935047,
    "lat": -6.1007104,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A21",
    "style": "#icon-1899-0288D1",
    "lng": 106.4935638,
    "lat": -6.1034982,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A22",
    "style": "#icon-1899-0288D1",
    "lng": 106.4934611,
    "lat": -6.1063271,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A23",
    "style": "#icon-1899-0288D1",
    "lng": 106.4939124,
    "lat": -6.1093347,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D24",
    "style": "#icon-1899-0288D1",
    "lng": 106.4944883,
    "lat": -6.1123446,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D25",
    "style": "#icon-1899-0288D1",
    "lng": 106.4948996,
    "lat": -6.1154144,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A26",
    "style": "#icon-1899-0288D1",
    "lng": 106.4953234,
    "lat": -6.1184688,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A27",
    "style": "#icon-1899-0288D1",
    "lng": 106.4950551,
    "lat": -6.121909,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A28",
    "style": "#icon-1899-0288D1",
    "lng": 106.4940275,
    "lat": -6.1248036,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A29",
    "style": "#icon-1899-0288D1",
    "lng": 106.4939203,
    "lat": -6.1271912,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A30",
    "style": "#icon-1899-0288D1",
    "lng": 106.4942751,
    "lat": -6.1302682,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A31",
    "style": "#icon-1899-0288D1",
    "lng": 106.4943484,
    "lat": -6.1334324,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A32",
    "style": "#icon-1899-0288D1",
    "lng": 106.4937729,
    "lat": -6.1364967,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A33",
    "style": "#icon-1899-0288D1",
    "lng": 106.4928551,
    "lat": -6.1395136,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A34",
    "style": "#icon-1899-0288D1",
    "lng": 106.4896751,
    "lat": -6.1391557,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A35",
    "style": "#icon-1899-0288D1",
    "lng": 106.4868901,
    "lat": -6.1398007,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #D36",
    "style": "#icon-1899-0288D1",
    "lng": 106.4860351,
    "lat": -6.1428224,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A37",
    "style": "#icon-1899-0288D1",
    "lng": 106.4851933,
    "lat": -6.1463344,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV LNTAR-SDJYA #A38",
    "style": "#icon-1899-0288D1",
    "lng": 106.484009,
    "lat": -6.1476767,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150KV LNTAR-SDJYA #0017",
    "style": "#icon-1899-0288D1",
    "lng": 106.491258379876,
    "lat": -6.09258402198436,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150KV LNTAR-SDJYA #0018",
    "style": "#icon-1899-0288D1",
    "lng": 106.493171156765,
    "lat": -6.09493902103441,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150KV TGRNG-JTKBR+JTKBR-JTAKE #A12A",
    "style": "#icon-1899-0288D1",
    "lng": 106.5944524,
    "lat": -6.2204808,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GJTGL-PSKBR+GJTGL-PSKMS #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.546252053148,
    "lat": -6.165343130013,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GJTGL-PSKBR+GJTGL-PSKMS #0009",
    "style": "#icon-1899-0288D1",
    "lng": 106.54451414873,
    "lat": -6.16427204875394,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GJTGL-PSKBR+GJTGL-PSKMS #0010",
    "style": "#icon-1899-0288D1",
    "lng": 106.542622388305,
    "lat": -6.16311097487665,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GJTGL-PSKBR+GJTGL-PSKMS #0011",
    "style": "#icon-1899-0288D1",
    "lng": 106.541232908548,
    "lat": -6.16066432771115,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GJTGL-PSKBR+GJTGL-PSKMS #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.548774598087,
    "lat": -6.16591455781439,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV GMKRU-PINKA #EA1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.780448,
    "lat": -6.1103083,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.6771796,
    "lat": -6.0610485,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.6744221,
    "lat": -6.0612881,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.6710732,
    "lat": -6.0622371,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.6686017,
    "lat": -6.0628156,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.6664949,
    "lat": -6.0632898,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.6640307,
    "lat": -6.0606982,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.6621125,
    "lat": -6.058584,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.6599778,
    "lat": -6.0560708,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0009",
    "style": "#icon-1899-0288D1",
    "lng": 106.6566057,
    "lat": -6.0539093,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0010",
    "style": "#icon-1899-0288D1",
    "lng": 106.6551285,
    "lat": -6.0522516,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0011",
    "style": "#icon-1899-0288D1",
    "lng": 106.652343,
    "lat": -6.0516666,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0012",
    "style": "#icon-1899-0288D1",
    "lng": 106.6502921,
    "lat": -6.0503527,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0013",
    "style": "#icon-1899-0288D1",
    "lng": 106.647402,
    "lat": -6.0519513,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0014",
    "style": "#icon-1899-0288D1",
    "lng": 106.6462645,
    "lat": -6.0545461,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0015",
    "style": "#icon-1899-0288D1",
    "lng": 106.6435729,
    "lat": -6.0551888,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0016",
    "style": "#icon-1899-0288D1",
    "lng": 106.6402275,
    "lat": -6.0560227,
    "type": "SUTT_150kV"
  },
  {
    "name": "TOWER SUTT 150kV DADAP-TLKNG+DADAP-LNTAR #0017",
    "style": "#icon-1899-0288D1",
    "lng": 106.6379385,
    "lat": -6.0574227,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7674049,
    "lat": -6.2233601,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7651195,
    "lat": -6.2203825,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7619625,
    "lat": -6.2173223,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7213856,
    "lat": -6.1880984,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7209676,
    "lat": -6.1875489,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7212565,
    "lat": -6.1879597,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7299365,
    "lat": -6.1907604,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7844271,
    "lat": -6.1126899,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7907285,
    "lat": -6.1338001,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5869724,
    "lat": -6.2106147,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7170841,
    "lat": -6.1894165,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.6983683,
    "lat": -6.1997032,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.6852884,
    "lat": -6.2109917,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.6801244,
    "lat": -6.2135512,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.6553311,
    "lat": -6.2200892,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7820968,
    "lat": -6.1905798,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5539449,
    "lat": -6.180951,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5542018,
    "lat": -6.1782457,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5516427,
    "lat": -6.1746884,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.551724,
    "lat": -6.1721645,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5485565,
    "lat": -6.16728,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5489201,
    "lat": -6.1672629,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5516878,
    "lat": -6.1721748,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5516063,
    "lat": -6.1746899,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5541497,
    "lat": -6.1782471,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.5539106,
    "lat": -6.18095,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7862969,
    "lat": -6.1674578,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7877226,
    "lat": -6.1699758,
    "type": "SUTT_150kV"
  },
  {
    "name": "Unnamed",
    "style": "#icon-1899-0288D1",
    "lng": 106.7630091,
    "lat": -6.2425895,
    "type": "SUTT_150kV"
  },
  {
    "name": "Point 305",
    "style": "#icon-1899-0288D1",
    "lng": 106.6432935,
    "lat": -6.2121077,
    "type": "SUTT_150kV"
  }
];

// 339 Tower SKTT
export const towerSKTT: TowerPoint[] = [
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.7279727,
    "lat": -6.173981802,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.7285198,
    "lat": -6.17924422,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.729579,
    "lat": -6.183464831,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.730415,
    "lat": -6.187869479,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.7330168,
    "lat": -6.191129867,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.7371271,
    "lat": -6.1911808,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.7410574,
    "lat": -6.191376121,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.7455545,
    "lat": -6.190998203,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0008A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7434443,
    "lat": -6.19103,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0009",
    "style": "#icon-1899-0288D1",
    "lng": 106.7511173,
    "lat": -6.1909203,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0010",
    "style": "#icon-1899-0288D1",
    "lng": 106.7555175,
    "lat": -6.190451882,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0011",
    "style": "#icon-1899-0288D1",
    "lng": 106.759143,
    "lat": -6.190207166,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0012",
    "style": "#icon-1899-0288D1",
    "lng": 106.7636203,
    "lat": -6.189878052,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0013",
    "style": "#icon-1899-0288D1",
    "lng": 106.768207,
    "lat": -6.189156596,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0014",
    "style": "#icon-1899-0288D1",
    "lng": 106.7714464,
    "lat": -6.189236059,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0015",
    "style": "#icon-1899-0288D1",
    "lng": 106.7757233,
    "lat": -6.187559049,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0016",
    "style": "#icon-1899-0288D1",
    "lng": 106.780023,
    "lat": -6.185993408,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0017",
    "style": "#icon-1899-0288D1",
    "lng": 106.7819547,
    "lat": -6.187951808,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV DKSBI-KBJRK #0018",
    "style": "#icon-1899-0288D1",
    "lng": 106.782209,
    "lat": -6.190631227,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-DKSBI #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.7277327,
    "lat": -6.171664475,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-DKSBI #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.7279483,
    "lat": -6.175182254,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-DKSBI #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.7282659,
    "lat": -6.17816597,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-DKSBI #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.728885,
    "lat": -6.181522685,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-DKSBI #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.7297078,
    "lat": -6.184816972,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-DKSBI #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.7268604,
    "lat": -6.185604862,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-DKSBI #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.7241545,
    "lat": -6.187218306,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-DKSBI #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.7212383,
    "lat": -6.188080812,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #001A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7843234,
    "lat": -6.113742956,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.7842594,
    "lat": -6.1138666,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #002A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7838095,
    "lat": -6.1170958,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.7837494,
    "lat": -6.1171865,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #003A",
    "style": "#icon-1899-0288D1",
    "lng": 106.783358,
    "lat": -6.120444,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.7833306,
    "lat": -6.1205066,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #004A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7834256,
    "lat": -6.1238044,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.7833875,
    "lat": -6.12389,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #005A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7837172,
    "lat": -6.1272126,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.7836901,
    "lat": -6.1273179,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #006A",
    "style": "#icon-1899-0288D1",
    "lng": 106.784461,
    "lat": -6.1304076,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.7844445,
    "lat": -6.1305282,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #007A",
    "style": "#icon-1899-0288D1",
    "lng": 106.788043,
    "lat": -6.1315176,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.7881029,
    "lat": -6.131577,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #008A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7900724,
    "lat": -6.1318935,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV MKRNG-ANGKE #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.7901147,
    "lat": -6.1319514,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #001A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7224502,
    "lat": -6.187582823,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #001B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7226349,
    "lat": -6.187630789,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #002A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7251902,
    "lat": -6.186596818,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #002B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7253364,
    "lat": -6.186615412,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #003A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7267146,
    "lat": -6.185564703,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #003B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7268494,
    "lat": -6.185558707,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #004A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7302106,
    "lat": -6.185753257,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #004B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7301557,
    "lat": -6.185765988,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #005A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7298684,
    "lat": -6.189565202,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-PTKGN #005B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7298209,
    "lat": -6.189551826,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.724243,
    "lat": -6.187229888,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.7291514,
    "lat": -6.184641089,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.7319207,
    "lat": -6.188848466,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.7367531,
    "lat": -6.19192362,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.7414413,
    "lat": -6.192864084,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.7440129,
    "lat": -6.194687387,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.7480545,
    "lat": -6.199253335,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0008",
    "style": "#icon-1899-0288D1",
    "lng": 106.7512165,
    "lat": -6.202470436,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0009",
    "style": "#icon-1899-0288D1",
    "lng": 106.7542387,
    "lat": -6.207119358,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0010",
    "style": "#icon-1899-0288D1",
    "lng": 106.7576423,
    "lat": -6.212503884,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0011",
    "style": "#icon-1899-0288D1",
    "lng": 106.7591973,
    "lat": -6.21768628,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0012",
    "style": "#icon-1899-0288D1",
    "lng": 106.7642711,
    "lat": -6.217934775,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0013",
    "style": "#icon-1899-0288D1",
    "lng": 106.767078,
    "lat": -6.22104152,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV KBANG-NSNYN #0014",
    "style": "#icon-1899-0288D1",
    "lng": 106.7698456,
    "lat": -6.223914434,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6588,
    "lat": -6.22095,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.662567,
    "lat": -6.220717,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.666433,
    "lat": -6.221,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6693451,
    "lat": -6.217937,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.672583,
    "lat": -6.216667,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.67665,
    "lat": -6.215567,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #7A",
    "style": "#icon-1899-0288D1",
    "lng": 106.679867,
    "lat": -6.21465,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV JTAKE-MAXIM #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.585152,
    "lat": -6.212766,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV JTAKE-MAXIM #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.5854987,
    "lat": -6.2104663,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.64060361019,
    "lat": -6.24309871157422,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.637868416659,
    "lat": -6.24109977100505,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.637913317018,
    "lat": -6.24100920526198,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.634500565811,
    "lat": -6.239057561308,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.634473064808,
    "lat": -6.2389310499308,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.630972042465,
    "lat": -6.23764880529085,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.631089345631,
    "lat": -6.23759418628873,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.632396270569,
    "lat": -6.23359329445228,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.632567677736,
    "lat": -6.2335023373101,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.63393803675,
    "lat": -6.22956454865241,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.634028173702,
    "lat": -6.2294919284155,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 7A",
    "style": "#icon-1899-0288D1",
    "lng": 106.636992815362,
    "lat": -6.22974497228756,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 7B",
    "style": "#icon-1899-0288D1",
    "lng": 106.636983807323,
    "lat": -6.22975404285828,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 8A",
    "style": "#icon-1899-0288D1",
    "lng": 106.63997884538,
    "lat": -6.2306590368075,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 8B",
    "style": "#icon-1899-0288D1",
    "lng": 106.639989204896,
    "lat": -6.23067781320382,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 9A",
    "style": "#icon-1899-0288D1",
    "lng": 106.639543508795,
    "lat": -6.22763916609051,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 9B",
    "style": "#icon-1899-0288D1",
    "lng": 106.639534500838,
    "lat": -6.22764823668459,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 10A",
    "style": "#icon-1899-0288D1",
    "lng": 106.638198890736,
    "lat": -6.22529226379197,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 10B",
    "style": "#icon-1899-0288D1",
    "lng": 106.638126658938,
    "lat": -6.22531057318536,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 11A",
    "style": "#icon-1899-0288D1",
    "lng": 106.642376983097,
    "lat": -6.22348884697049,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 11B",
    "style": "#icon-1899-0288D1",
    "lng": 106.642476350239,
    "lat": -6.22347949527732,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 12A",
    "style": "#icon-1899-0288D1",
    "lng": 106.646275771927,
    "lat": -6.22195755230888,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 12B",
    "style": "#icon-1899-0288D1",
    "lng": 106.646375138527,
    "lat": -6.22194819997515,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 13A",
    "style": "#icon-1899-0288D1",
    "lng": 106.650048763268,
    "lat": -6.22066173413567,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 13B",
    "style": "#icon-1899-0288D1",
    "lng": 106.65010297835,
    "lat": -6.22066156477892,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 14A",
    "style": "#icon-1899-0288D1",
    "lng": 106.654284732991,
    "lat": -6.22006071994366,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 14B",
    "style": "#icon-1899-0288D1",
    "lng": 106.654338919619,
    "lat": -6.22005150771681,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Summarecon - Alam Sutera 1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.640567465094,
    "lat": -6.24309882423273,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.611803000442,
    "lat": -6.24519500396196,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.616484996476,
    "lat": -6.2431260043451,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.616915004093,
    "lat": -6.24325800010732,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.621431998278,
    "lat": -6.2428300044245,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.621805004243,
    "lat": -6.24277999773474,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.625613004313,
    "lat": -6.24286300056724,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.625858002804,
    "lat": -6.24294599700392,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.631477001384,
    "lat": -6.24350200469233,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.631177001106,
    "lat": -6.24349599882291,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.63493399897,
    "lat": -6.24545499989938,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.634704999427,
    "lat": -6.24540600412752,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 7A",
    "style": "#icon-1899-0288D1",
    "lng": 106.637889004172,
    "lat": -6.24318599910658,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 7B",
    "style": "#icon-1899-0288D1",
    "lng": 106.63826699778,
    "lat": -6.24261099712891,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 8A",
    "style": "#icon-1899-0288D1",
    "lng": 106.640725000964,
    "lat": -6.24317299789772,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 8B",
    "style": "#icon-1899-0288D1",
    "lng": 106.640725000964,
    "lat": -6.24317299789772,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT 150kV Curug - Summarecon 1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.611612002898,
    "lat": -6.24509699618796,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.66277778,
    "lat": -6.22072222,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6664458,
    "lat": -6.2209235,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.66916667,
    "lat": -6.21797222,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6725,
    "lat": -6.21669444,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6766509,
    "lat": -6.2155865,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #7B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6798414,
    "lat": -6.2146776,
    "type": "SKTT_150kV"
  },
  {
    "name": "JALUR SKTT 150kV ALSTA-CLDUG #1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6588307,
    "lat": -6.2209782,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.68335305006,
    "lat": -6.21154136727617,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.687832251731,
    "lat": -6.21076753357875,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.687615457237,
    "lat": -6.2107863099616,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.687973126755,
    "lat": -6.20677034703747,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.688099680417,
    "lat": -6.20678802828201,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.688708327231,
    "lat": -6.2021382988333,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.688618721934,
    "lat": -6.20237368660942,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.692161,
    "lat": -6.1997238,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.691854484589,
    "lat": -6.19987670910449,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6963294,
    "lat": -6.1994149,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.696072491077,
    "lat": -6.19940206653551,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #7A",
    "style": "#icon-1899-0288D1",
    "lng": 106.699273353177,
    "lat": -6.19731207483279,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #7B",
    "style": "#icon-1899-0288D1",
    "lng": 106.699211177264,
    "lat": -6.19764684082054,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #8A",
    "style": "#icon-1899-0288D1",
    "lng": 106.701759916006,
    "lat": -6.19507064326085,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #8B",
    "style": "#icon-1899-0288D1",
    "lng": 106.70169666981,
    "lat": -6.19507084619213,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #9A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7045417,
    "lat": -6.197765,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #9B",
    "style": "#icon-1899-0288D1",
    "lng": 106.704515747726,
    "lat": -6.19791012420764,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 2A (Nama Proyek Joint 10A)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7080886,
    "lat": -6.1963072,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 2B (Nama Proyek Joint 10B)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7081613,
    "lat": -6.1964516,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 3A (Nama Proyek Joint 11A)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7104303,
    "lat": -6.1924101,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 3B (Nama Proyek Joint 11B)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7104181,
    "lat": -6.1925049,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 4A (Nama Proyek Joint 12A)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7129097,
    "lat": -6.1895268,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 4B (Nama Proyek Joint 12B)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7129673,
    "lat": -6.189565,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 5A (Nama Proyek Joint 13A)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7169312,
    "lat": -6.1898224,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 5B (Nama Proyek Joint 13B)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7168953,
    "lat": -6.1898949,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Kembangan #1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.683524466657,
    "lat": -6.21145944006169,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV NSYAN-ULJMI #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.76497672749,
    "lat": -6.23785888445613,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV NSYAN-ULJMI #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.769377785936,
    "lat": -6.23806112818232,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV NSYAN-ULJMI #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.771936600308,
    "lat": -6.23588244942946,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV NSYAN-ULJMI #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.771875761972,
    "lat": -6.23121698677144,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV NSYAN-ULJMI #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.762863425512,
    "lat": -6.24087695761409,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV GRGOL-TMANG #0002",
    "style": "#icon-1899-0288D1",
    "lng": 106.78831858542,
    "lat": -6.17170180561318,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV GRGOL-TMANG #0003",
    "style": "#icon-1899-0288D1",
    "lng": 106.787539296369,
    "lat": -6.17370269042639,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV GRGOL-TMANG #0004",
    "style": "#icon-1899-0288D1",
    "lng": 106.783521104721,
    "lat": -6.1743491092779,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV GRGOL-TMANG #0005",
    "style": "#icon-1899-0288D1",
    "lng": 106.783636466301,
    "lat": -6.1791228730432,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV GRGOL-TMANG #0006",
    "style": "#icon-1899-0288D1",
    "lng": 106.783435631746,
    "lat": -6.18389769691822,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV GRGOL-TMANG #0007",
    "style": "#icon-1899-0288D1",
    "lng": 106.779811013721,
    "lat": -6.18608896578569,
    "type": "SKTT_150kV"
  },
  {
    "name": "JOINT SKTT 150kV GRGOL-TMANG #0001",
    "style": "#icon-1899-0288D1",
    "lng": 106.787256239156,
    "lat": -6.16741949564211,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Metland 10A (Nama Proyek Joint 2B)",
    "style": "#icon-1899-0288D1",
    "lng": 106.706661,
    "lat": -6.197412,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Ciledug - Metland 10B (Nama Proyek Joint 1B)",
    "style": "#icon-1899-0288D1",
    "lng": 106.706784,
    "lat": -6.197419,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 1B (Nama Proyek Joint 1A)",
    "style": "#icon-1899-0288D1",
    "lng": 106.7073759,
    "lat": -6.1975095,
    "type": "SKTT_150kV"
  },
  {
    "name": "Jalur SKTT Metland - Kembangan 1A (Nama Proyek Joint 2A)",
    "style": "#icon-1899-0288D1",
    "lng": 106.707296,
    "lat": -6.197452,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP14-SEALING END",
    "style": "#icon-1899-0288D1",
    "lng": 106.7719597,
    "lat": -6.2261522,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP10-JP11",
    "style": "#icon-1899-0288D1",
    "lng": 106.7579646,
    "lat": -6.2156817,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP9-JP10",
    "style": "#icon-1899-0288D1",
    "lng": 106.7560606,
    "lat": -6.2099835,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP8-JP9",
    "style": "#icon-1899-0288D1",
    "lng": 106.7527776,
    "lat": -6.2048742,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP7-JP8",
    "style": "#icon-1899-0288D1",
    "lng": 106.7510528,
    "lat": -6.1995106,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP6-JP7",
    "style": "#icon-1899-0288D1",
    "lng": 106.745782,
    "lat": -6.1974559,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP5-JP6",
    "style": "#icon-1899-0288D1",
    "lng": 106.7431067,
    "lat": -6.1932881,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP3-JP4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7338027,
    "lat": -6.1900997,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP2-JP3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7308672,
    "lat": -6.186788,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP1-JP2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7266997,
    "lat": -6.1857295,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP17-JP18",
    "style": "#icon-1899-0288D1",
    "lng": 106.7829594,
    "lat": -6.1893675,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP16-JP17",
    "style": "#icon-1899-0288D1",
    "lng": 106.7818047,
    "lat": -6.1860893,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP15-JP16",
    "style": "#icon-1899-0288D1",
    "lng": 106.7779558,
    "lat": -6.186742,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP14-JP15",
    "style": "#icon-1899-0288D1",
    "lng": 106.7735579,
    "lat": -6.1884076,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP13-JP14",
    "style": "#icon-1899-0288D1",
    "lng": 106.7693382,
    "lat": -6.1894816,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP12-JP13",
    "style": "#icon-1899-0288D1",
    "lng": 106.7661111,
    "lat": -6.1897464,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP11-JP12",
    "style": "#icon-1899-0288D1",
    "lng": 106.761333,
    "lat": -6.1900456,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP10-JP11",
    "style": "#icon-1899-0288D1",
    "lng": 106.7567784,
    "lat": -6.1903655,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP9-JP10",
    "style": "#icon-1899-0288D1",
    "lng": 106.7535633,
    "lat": -6.1906781,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP8-JP9",
    "style": "#icon-1899-0288D1",
    "lng": 106.7482364,
    "lat": -6.1909661,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP8A-JP8",
    "style": "#icon-1899-0288D1",
    "lng": 106.7445233,
    "lat": -6.1910067,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP7-JP8A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7423034,
    "lat": -6.1911932,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP6-JP7",
    "style": "#icon-1899-0288D1",
    "lng": 106.7390603,
    "lat": -6.1912805,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP5-JP6",
    "style": "#icon-1899-0288D1",
    "lng": 106.7350328,
    "lat": -6.1911593,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP4-JP5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7318136,
    "lat": -6.1896483,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP3-JP4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7299517,
    "lat": -6.1854355,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP2-JP3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7288802,
    "lat": -6.1811039,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN JP1-JP2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7282286,
    "lat": -6.1769485,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT DKSBI-KBJRK SPAN SEALING END-JP1",
    "style": "#icon-1899-0288D1",
    "lng": 106.7268163,
    "lat": -6.1725198,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-DKSBI SPAN SEALING END-JP1",
    "style": "#icon-1899-0288D1",
    "lng": 106.7276576,
    "lat": -6.1702631,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-DKSBI SPAN JP1-JP2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7278219,
    "lat": -6.1732176,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-DKSBI SPAN JP2-JP3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7281274,
    "lat": -6.1769396,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-DKSBI SPAN JP3-JP4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7285522,
    "lat": -6.1797687,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-DKSBI SPAN JP4-JP5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7292777,
    "lat": -6.183114,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-DKSBI SPAN JP5-JP6",
    "style": "#icon-1899-0288D1",
    "lng": 106.7282109,
    "lat": -6.1847328,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-DKSBI SPAN JP6-JP7",
    "style": "#icon-1899-0288D1",
    "lng": 106.7256934,
    "lat": -6.1863027,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-DKSBI SPAN JP7-JP8",
    "style": "#icon-1899-0288D1",
    "lng": 106.7234926,
    "lat": -6.1874132,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP1A-JP2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.723788,
    "lat": -6.1870994,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP2A-JP3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7260418,
    "lat": -6.1860184,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP3A-JP4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7281801,
    "lat": -6.1847193,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP4A-JP5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7304323,
    "lat": -6.1877214,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP5B-SEALING END",
    "style": "#icon-1899-0288D1",
    "lng": 106.7298515,
    "lat": -6.1907481,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP4B-JP5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7303844,
    "lat": -6.1877187,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP3B-JP4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7282122,
    "lat": -6.1847806,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP2B-JP3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7260886,
    "lat": -6.1860864,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN JP1B-JP2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7238148,
    "lat": -6.1871827,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBGN-PTKGN SPAN SEALING END-JP1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7212795,
    "lat": -6.1880144,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN SEALING END-JP1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7844816,
    "lat": -6.112686,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP1-JP2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7840324,
    "lat": -6.1153307,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP1A-JP2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.784078,
    "lat": -6.1153294,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP2-JP3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7835025,
    "lat": -6.1191249,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP2A-JP3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7835373,
    "lat": -6.1191209,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP3-JP4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7833568,
    "lat": -6.1220378,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP3A-JP4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7833889,
    "lat": -6.1220325,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP4-JP5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7833731,
    "lat": -6.1255463,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP4A-JP5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7834126,
    "lat": -6.1255414,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP5-JP6",
    "style": "#icon-1899-0288D1",
    "lng": 106.7840601,
    "lat": -6.1288927,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP5A-JP6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7841044,
    "lat": -6.1288727,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP6A-JP7A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7863586,
    "lat": -6.1312891,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP6-JP7",
    "style": "#icon-1899-0288D1",
    "lng": 106.7864256,
    "lat": -6.1313745,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP7-JP8",
    "style": "#icon-1899-0288D1",
    "lng": 106.7891119,
    "lat": -6.1317648,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP7A-JP8A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7891426,
    "lat": -6.1317226,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT MKRLM-ANGKE SPAN JP8A-SEALING END",
    "style": "#icon-1899-0288D1",
    "lng": 106.7906802,
    "lat": -6.1337975,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT JTAKE-MAXIM SPAN SEALING END-JP1",
    "style": "#icon-1899-0288D1",
    "lng": 106.5851584,
    "lat": -6.2142582,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT JTAKE-MAXIM SPAN JP1-JP2",
    "style": "#icon-1899-0288D1",
    "lng": 106.584835,
    "lat": -6.2113681,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP13B-SEALING END",
    "style": "#icon-1899-0288D1",
    "lng": 106.7170908,
    "lat": -6.1894512,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP12A-JP13A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7146051,
    "lat": -6.1903612,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP12B-JP13B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7145944,
    "lat": -6.1904228,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP11A-JP12A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7112007,
    "lat": -6.1907772,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP11B-JP12B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7112436,
    "lat": -6.1908012,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP10A-JP11A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7093986,
    "lat": -6.1944244,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP10B-JP11B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7094778,
    "lat": -6.1944164,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP9A-JP10A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7063993,
    "lat": -6.197188,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP9B-JP10B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7063858,
    "lat": -6.1972701,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP8A-JP9A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7028578,
    "lat": -6.1969122,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP8B-JP9B",
    "style": "#icon-1899-0288D1",
    "lng": 106.7028433,
    "lat": -6.1969707,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP7A-JP8A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6998216,
    "lat": -6.1955248,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP7B-JP8B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6998699,
    "lat": -6.1955448,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP6B-JP7B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6984058,
    "lat": -6.1997565,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP5A-JP6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6940263,
    "lat": -6.19865,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP5B-JP6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.693986,
    "lat": -6.1987366,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP4A-JP5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6897439,
    "lat": -6.2003402,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP4B-JP5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6897499,
    "lat": -6.200385,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP3B-JP4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6881061,
    "lat": -6.2038472,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP3A-JP4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.688031,
    "lat": -6.2037872,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP2A-JP3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6881115,
    "lat": -6.2090333,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP2B-JP3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6881692,
    "lat": -6.2090413,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN JP1B-JP2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6852964,
    "lat": -6.2110477,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN SEALING END-JP1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6815263,
    "lat": -6.2120289,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CLDUG-KMBGN SPAN SEALING END-JP1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6815236,
    "lat": -6.2119743,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP7B-SEALING END",
    "style": "#icon-1899-0288D1",
    "lng": 106.6801432,
    "lat": -6.2135725,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP6A-JP7A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6783331,
    "lat": -6.2150722,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP6B-JP7B",
    "style": "#icon-1899-0288D1",
    "lng": 106.678384,
    "lat": -6.2150829,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP5A-JP6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6746362,
    "lat": -6.2161111,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP5B-JP6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6746858,
    "lat": -6.2161124,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP4A-JP5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6711799,
    "lat": -6.2176305,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP4B-JP5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6711415,
    "lat": -6.217641,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP3A-JP4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6688973,
    "lat": -6.2189871,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP3B-JP4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.668904,
    "lat": -6.2189217,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP2B-JP3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6644724,
    "lat": -6.2207553,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP2A-JP3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6645334,
    "lat": -6.2207461,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP1A-JP2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6603731,
    "lat": -6.2209321,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN JP1B-JP2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6604066,
    "lat": -6.2209588,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN SEALING END-JP1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6574682,
    "lat": -6.2206222,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT ALSTA-CLDUG SPAN SEALING END-JP1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6574921,
    "lat": -6.2206662,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP14B-SEALING END",
    "style": "#icon-1899-0288D1",
    "lng": 106.6553166,
    "lat": -6.2201277,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP13A-JP14A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6524769,
    "lat": -6.22034,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP13B-JP14B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6525118,
    "lat": -6.220368,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP12A-JP13A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6482284,
    "lat": -6.2217607,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP12B-JP13B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6482472,
    "lat": -6.2217981,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP11A-JP12A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6445302,
    "lat": -6.2226179,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP11B-JP12B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6446214,
    "lat": -6.2226219,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP10A-JP11A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6402637,
    "lat": -6.2244624,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP10B-JP11B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6403213,
    "lat": -6.2244643,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP9A-JP10A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6384833,
    "lat": -6.2264266,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP9B-JP10B",
    "style": "#icon-1899-0288D1",
    "lng": 106.638482,
    "lat": -6.2264706,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP8A-JP9A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6407582,
    "lat": -6.2293903,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP8B-JP9B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6407609,
    "lat": -6.2294383,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP7A-JP8A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6383024,
    "lat": -6.2309359,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP7B-JP8B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6383427,
    "lat": -6.2310132,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP6A-JP7A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6357212,
    "lat": -6.2289195,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP6B-JP7B",
    "style": "#icon-1899-0288D1",
    "lng": 106.635736,
    "lat": -6.2289515,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP5A-JP6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6330795,
    "lat": -6.231795,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP5B-JP6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.633164,
    "lat": -6.231715,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP4A-JP5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6317922,
    "lat": -6.2354149,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP4B-JP5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6318606,
    "lat": -6.2353376,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP3A-JP4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6323085,
    "lat": -6.2386487,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP3B-JP4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6323497,
    "lat": -6.2385603,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP2A-JP3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6368722,
    "lat": -6.2393407,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP2B-JP3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6370659,
    "lat": -6.2393027,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP1A-JP2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6381432,
    "lat": -6.2412996,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN JP1B-JP2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6381271,
    "lat": -6.2411796,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN SEALING END-JP1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6414691,
    "lat": -6.2433581,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT SGSPG-ALSTA SPAN SEALING END-JP1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6415241,
    "lat": -6.2432981,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP8A-SEALING END",
    "style": "#icon-1899-0288D1",
    "lng": 106.6416032,
    "lat": -6.2433184,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP8B-SEALING END",
    "style": "#icon-1899-0288D1",
    "lng": 106.6416649,
    "lat": -6.2433331,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP7A-JP8A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6387594,
    "lat": -6.2425662,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP7B-JP8B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6387031,
    "lat": -6.2427088,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP6A-JP7A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6368606,
    "lat": -6.244809,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP6B-JP7B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6369424,
    "lat": -6.2447437,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP5A-JP6A",
    "style": "#icon-1899-0288D1",
    "lng": 106.633176,
    "lat": -6.2443875,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP5B-JP6B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6330929,
    "lat": -6.2443475,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP4A-JP5A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6295128,
    "lat": -6.2434818,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP4B-JP5B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6296281,
    "lat": -6.2435324,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP3A-JP4A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6230062,
    "lat": -6.2424788,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP3B-JP4B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6229847,
    "lat": -6.2425695,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP2A-JP3A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6195029,
    "lat": -6.2432389,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP2B-JP3B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6194399,
    "lat": -6.2433616,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP1A-JP2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6142459,
    "lat": -6.2439045,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN JP1B-JP2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6143156,
    "lat": -6.2440512,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN SEALING END-JP1A",
    "style": "#icon-1899-0288D1",
    "lng": 106.6110608,
    "lat": -6.2436406,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT CURUG-SGSPG SPAN SEALING END-JP1B",
    "style": "#icon-1899-0288D1",
    "lng": 106.6110187,
    "lat": -6.2437503,
    "type": "SKTT_150kV"
  },
  {
    "name": "SKTT KMBNG-NSYAN SPAN JP4-JP5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7387455,
    "lat": -6.1919274,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT GGGOL-TMANG #3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7881882,
    "lat": -6.1736906,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT GGGOL-TMANG #4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7852747,
    "lat": -6.1737512,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT GGGOL-TMANG #5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7835985,
    "lat": -6.1777468,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT GGGOL-TMANG #6",
    "style": "#icon-1899-0288D1",
    "lng": 106.7836045,
    "lat": -6.1824347,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT GGGOL-TMANG #7",
    "style": "#icon-1899-0288D1",
    "lng": 106.7833394,
    "lat": -6.1847259,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT GGGOL-TMANG #7-SE",
    "style": "#icon-1899-0288D1",
    "lng": 106.779162,
    "lat": -6.1863338,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT NSYAN-ULJMI #2",
    "style": "#icon-1899-0288D1",
    "lng": 106.7634003,
    "lat": -6.2395174,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT NSYAN-ULJMI #3",
    "style": "#icon-1899-0288D1",
    "lng": 106.7688453,
    "lat": -6.2380348,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT NSYAN-ULJMI #4",
    "style": "#icon-1899-0288D1",
    "lng": 106.7719917,
    "lat": -6.2374107,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT NSYAN-ULJMI #5",
    "style": "#icon-1899-0288D1",
    "lng": 106.7718719,
    "lat": -6.2328354,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT NSYAN-ULJMI #5-SE",
    "style": "#icon-1899-0288D1",
    "lng": 106.7719056,
    "lat": -6.229509,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT MKBRU-MKRNG #000SE-SE",
    "style": "#icon-1899-0288D1",
    "lng": 106.7821455,
    "lat": -6.110032,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT CNKNG-CKBRU #000SE-SE",
    "style": "#icon-1899-0288D1",
    "lng": 106.6588635,
    "lat": -6.1502036,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT CKBRU-TGRBR #000SE-SE",
    "style": "#icon-1899-0288D1",
    "lng": 106.6590592,
    "lat": -6.1501154,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT MKBRU-GMKRU #00SE-SE",
    "style": "#icon-1899-0288D1",
    "lng": 106.7816639,
    "lat": -6.1102228,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT METLAND-KEMBANGAN JP1A-2A",
    "style": "#icon-1899-0288D1",
    "lng": 106.7076818,
    "lat": -6.196876,
    "type": "SKTT_150kV"
  },
  {
    "name": "SPAN SKTT METLAND-KEMBANGAN JP1B-2B",
    "style": "#icon-1899-0288D1",
    "lng": 106.707773,
    "lat": -6.196924,
    "type": "SKTT_150kV"
  }
];

// 52 Jalur Transmisi
export const jalurTransmisi: JalurTransmisi[] = [
  {
    "name": "CILEDUG - ALAM SUTERA",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6562558,
        "lat": -6.2201209
      },
      {
        "lng": 106.6559769,
        "lat": -6.2205369
      },
      {
        "lng": 106.6565348,
        "lat": -6.2208568
      },
      {
        "lng": 106.6567923,
        "lat": -6.2208675
      },
      {
        "lng": 106.6570605,
        "lat": -6.2206648
      },
      {
        "lng": 106.6574682,
        "lat": -6.2206222
      },
      {
        "lng": 106.657833,
        "lat": -6.2207715
      },
      {
        "lng": 106.6581012,
        "lat": -6.2210168
      },
      {
        "lng": 106.6588,
        "lat": -6.22095
      },
      {
        "lng": 106.6604186,
        "lat": -6.2209315
      },
      {
        "lng": 106.6613413,
        "lat": -6.2208355
      },
      {
        "lng": 106.6615988,
        "lat": -6.2208462
      },
      {
        "lng": 106.662567,
        "lat": -6.220717
      },
      {
        "lng": 106.6640235,
        "lat": -6.2205262
      },
      {
        "lng": 106.6644527,
        "lat": -6.2207182
      },
      {
        "lng": 106.6653217,
        "lat": -6.2210488
      },
      {
        "lng": 106.6659118,
        "lat": -6.2210915
      },
      {
        "lng": 106.666433,
        "lat": -6.221
      },
      {
        "lng": 106.6671027,
        "lat": -6.2206755
      },
      {
        "lng": 106.6671349,
        "lat": -6.2202275
      },
      {
        "lng": 106.6669632,
        "lat": -6.2197583
      },
      {
        "lng": 106.6671778,
        "lat": -6.2195983
      },
      {
        "lng": 106.6679717,
        "lat": -6.2196196
      },
      {
        "lng": 106.6687978,
        "lat": -6.2191396
      },
      {
        "lng": 106.6690446,
        "lat": -6.2187557
      },
      {
        "lng": 106.6691733,
        "lat": -6.2181157
      },
      {
        "lng": 106.6693451,
        "lat": -6.217937
      },
      {
        "lng": 106.6698063,
        "lat": -6.2175505
      },
      {
        "lng": 106.6710294,
        "lat": -6.2177638
      },
      {
        "lng": 106.6711799,
        "lat": -6.2176305
      },
      {
        "lng": 106.6713462,
        "lat": -6.2175238
      },
      {
        "lng": 106.6715984,
        "lat": -6.2170199
      },
      {
        "lng": 106.6719095,
        "lat": -6.2168546
      },
      {
        "lng": 106.672583,
        "lat": -6.216667
      },
      {
        "lng": 106.6752676,
        "lat": -6.2159426
      },
      {
        "lng": 106.67665,
        "lat": -6.215567
      },
      {
        "lng": 106.6788082,
        "lat": -6.2149347
      },
      {
        "lng": 106.679867,
        "lat": -6.21465
      },
      {
        "lng": 106.6801814,
        "lat": -6.2144601
      },
      {
        "lng": 106.6801493,
        "lat": -6.2138735
      },
      {
        "lng": 106.6801171,
        "lat": -6.2134042
      },
      {
        "lng": 106.6801922,
        "lat": -6.2128709
      },
      {
        "lng": 106.6800527,
        "lat": -6.2123163
      },
      {
        "lng": 106.6799132,
        "lat": -6.2119056
      },
      {
        "lng": 106.6797952,
        "lat": -6.2115963
      }
    ]
  },
  {
    "name": "MUARAKARANG LAMA - ANGKE",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7878076,
        "lat": -6.1115125
      },
      {
        "lng": 106.7877861,
        "lat": -6.1121473
      },
      {
        "lng": 106.7855813,
        "lat": -6.1121846
      },
      {
        "lng": 106.7844816,
        "lat": -6.112686
      },
      {
        "lng": 106.7843234,
        "lat": -6.113743
      },
      {
        "lng": 106.7838095,
        "lat": -6.1170958
      },
      {
        "lng": 106.783358,
        "lat": -6.120444
      },
      {
        "lng": 106.7834256,
        "lat": -6.1238044
      },
      {
        "lng": 106.7834126,
        "lat": -6.1255414
      },
      {
        "lng": 106.7837172,
        "lat": -6.1272126
      },
      {
        "lng": 106.784461,
        "lat": -6.1304076
      },
      {
        "lng": 106.7847913,
        "lat": -6.1311259
      },
      {
        "lng": 106.785832,
        "lat": -6.1312272
      },
      {
        "lng": 106.788043,
        "lat": -6.1315176
      },
      {
        "lng": 106.7900724,
        "lat": -6.1318935
      },
      {
        "lng": 106.790617,
        "lat": -6.1326033
      },
      {
        "lng": 106.7907351,
        "lat": -6.1338727
      },
      {
        "lng": 106.7908191,
        "lat": -6.1349312
      }
    ]
  },
  {
    "name": "MUARAKARANG LAMA - ANGKE",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.787727,
        "lat": -6.1115296
      },
      {
        "lng": 106.7876989,
        "lat": -6.112139
      },
      {
        "lng": 106.7855831,
        "lat": -6.1121645
      },
      {
        "lng": 106.7844271,
        "lat": -6.1126899
      },
      {
        "lng": 106.7842594,
        "lat": -6.1138666
      },
      {
        "lng": 106.7837494,
        "lat": -6.1171865
      },
      {
        "lng": 106.7833306,
        "lat": -6.1205066
      },
      {
        "lng": 106.7833875,
        "lat": -6.12389
      },
      {
        "lng": 106.7833731,
        "lat": -6.1255463
      },
      {
        "lng": 106.7836901,
        "lat": -6.1273179
      },
      {
        "lng": 106.7844445,
        "lat": -6.1305282
      },
      {
        "lng": 106.7847769,
        "lat": -6.1311839
      },
      {
        "lng": 106.7881029,
        "lat": -6.131577
      },
      {
        "lng": 106.7901147,
        "lat": -6.1319514
      },
      {
        "lng": 106.7905779,
        "lat": -6.1326034
      },
      {
        "lng": 106.7907818,
        "lat": -6.1349369
      }
    ]
  },
  {
    "name": "DURIKOSAMBI - KEMBANGAN",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7259424,
        "lat": -6.1696076
      },
      {
        "lng": 106.7268329,
        "lat": -6.1695809
      },
      {
        "lng": 106.7268972,
        "lat": -6.1697783
      },
      {
        "lng": 106.7276375,
        "lat": -6.1699223
      },
      {
        "lng": 106.7277327,
        "lat": -6.1716645
      },
      {
        "lng": 106.7279483,
        "lat": -6.1751823
      },
      {
        "lng": 106.7282659,
        "lat": -6.178166
      },
      {
        "lng": 106.728885,
        "lat": -6.1815227
      },
      {
        "lng": 106.7297078,
        "lat": -6.184817
      },
      {
        "lng": 106.729448,
        "lat": -6.1848661
      },
      {
        "lng": 106.7289357,
        "lat": -6.1845274
      },
      {
        "lng": 106.7283805,
        "lat": -6.1846261
      },
      {
        "lng": 106.7268604,
        "lat": -6.1856049
      },
      {
        "lng": 106.7241545,
        "lat": -6.1872183
      },
      {
        "lng": 106.7212383,
        "lat": -6.1880808
      },
      {
        "lng": 106.720858,
        "lat": -6.1873235
      },
      {
        "lng": 106.719541,
        "lat": -6.1877181
      }
    ]
  },
  {
    "name": "DURIKOSAMBI - KEBON JERUK",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7256616,
        "lat": -6.1705232
      },
      {
        "lng": 106.7258551,
        "lat": -6.1723757
      },
      {
        "lng": 106.726928,
        "lat": -6.1725357
      },
      {
        "lng": 106.7279727,
        "lat": -6.1739818
      },
      {
        "lng": 106.7283362,
        "lat": -6.1782132
      },
      {
        "lng": 106.7285198,
        "lat": -6.1792442
      },
      {
        "lng": 106.7289692,
        "lat": -6.1815518
      },
      {
        "lng": 106.729579,
        "lat": -6.1834648
      },
      {
        "lng": 106.730415,
        "lat": -6.1878695
      },
      {
        "lng": 106.7330168,
        "lat": -6.1911299
      },
      {
        "lng": 106.7371271,
        "lat": -6.1911808
      },
      {
        "lng": 106.7410574,
        "lat": -6.1913761
      },
      {
        "lng": 106.7434443,
        "lat": -6.19103
      },
      {
        "lng": 106.7455545,
        "lat": -6.1909982
      },
      {
        "lng": 106.7511457,
        "lat": -6.1909329
      },
      {
        "lng": 106.7555175,
        "lat": -6.1904519
      },
      {
        "lng": 106.759143,
        "lat": -6.1902072
      },
      {
        "lng": 106.7636203,
        "lat": -6.1898781
      },
      {
        "lng": 106.766724,
        "lat": -6.189717
      },
      {
        "lng": 106.768207,
        "lat": -6.1891566
      },
      {
        "lng": 106.7691272,
        "lat": -6.189237
      },
      {
        "lng": 106.7694706,
        "lat": -6.1896423
      },
      {
        "lng": 106.7714464,
        "lat": -6.1892361
      },
      {
        "lng": 106.7757233,
        "lat": -6.187559
      },
      {
        "lng": 106.780023,
        "lat": -6.1859934
      },
      {
        "lng": 106.7817551,
        "lat": -6.1854611
      },
      {
        "lng": 106.7819547,
        "lat": -6.1879518
      },
      {
        "lng": 106.7832812,
        "lat": -6.1881143
      },
      {
        "lng": 106.782954,
        "lat": -6.1893836
      },
      {
        "lng": 106.7824605,
        "lat": -6.1904876
      },
      {
        "lng": 106.782209,
        "lat": -6.1906312
      },
      {
        "lng": 106.7819993,
        "lat": -6.1905375
      }
    ]
  },
  {
    "name": "KEMBANGAN - PETUKANGAN",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7190846,
        "lat": -6.1880786
      },
      {
        "lng": 106.7193421,
        "lat": -6.1887719
      },
      {
        "lng": 106.71968,
        "lat": -6.1888253
      },
      {
        "lng": 106.7200984,
        "lat": -6.1886653
      },
      {
        "lng": 106.7203452,
        "lat": -6.1884733
      },
      {
        "lng": 106.7205705,
        "lat": -6.1881799
      },
      {
        "lng": 106.7224502,
        "lat": -6.1875828
      },
      {
        "lng": 106.7251902,
        "lat": -6.1865968
      },
      {
        "lng": 106.7267146,
        "lat": -6.1855647
      },
      {
        "lng": 106.7280163,
        "lat": -6.1847934
      },
      {
        "lng": 106.7286547,
        "lat": -6.1845187
      },
      {
        "lng": 106.728888,
        "lat": -6.1844947
      },
      {
        "lng": 106.7297785,
        "lat": -6.1851107
      },
      {
        "lng": 106.7302106,
        "lat": -6.1857533
      },
      {
        "lng": 106.7304813,
        "lat": -6.1881319
      },
      {
        "lng": 106.7303311,
        "lat": -6.1890279
      },
      {
        "lng": 106.7298684,
        "lat": -6.1895652
      },
      {
        "lng": 106.7296605,
        "lat": -6.1899772
      },
      {
        "lng": 106.729682,
        "lat": -6.1904145
      },
      {
        "lng": 106.7310592,
        "lat": -6.1922835
      }
    ]
  },
  {
    "name": "KEMBANGAN - PETUKANGAN",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7190846,
        "lat": -6.1880786
      },
      {
        "lng": 106.7193421,
        "lat": -6.1887719
      },
      {
        "lng": 106.71968,
        "lat": -6.1888253
      },
      {
        "lng": 106.7200984,
        "lat": -6.1886653
      },
      {
        "lng": 106.7203806,
        "lat": -6.1884855
      },
      {
        "lng": 106.7206059,
        "lat": -6.1882135
      },
      {
        "lng": 106.7226349,
        "lat": -6.1876308
      },
      {
        "lng": 106.7253364,
        "lat": -6.1866154
      },
      {
        "lng": 106.7268494,
        "lat": -6.1855587
      },
      {
        "lng": 106.7284326,
        "lat": -6.1846562
      },
      {
        "lng": 106.7289583,
        "lat": -6.1845602
      },
      {
        "lng": 106.7297469,
        "lat": -6.1851522
      },
      {
        "lng": 106.7301557,
        "lat": -6.185766
      },
      {
        "lng": 106.7304389,
        "lat": -6.1881655
      },
      {
        "lng": 106.7302887,
        "lat": -6.1889921
      },
      {
        "lng": 106.7298209,
        "lat": -6.1895518
      },
      {
        "lng": 106.7296021,
        "lat": -6.1899894
      },
      {
        "lng": 106.7296342,
        "lat": -6.1904694
      },
      {
        "lng": 106.7310592,
        "lat": -6.1922835
      }
    ]
  },
  {
    "name": "KEMBANGAN - NEW SENAYAN",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.719541,
        "lat": -6.1877181
      },
      {
        "lng": 106.7208389,
        "lat": -6.1873821
      },
      {
        "lng": 106.7212252,
        "lat": -6.1881501
      },
      {
        "lng": 106.724243,
        "lat": -6.1872299
      },
      {
        "lng": 106.7284081,
        "lat": -6.1846942
      },
      {
        "lng": 106.7289499,
        "lat": -6.1846035
      },
      {
        "lng": 106.7291514,
        "lat": -6.1846411
      },
      {
        "lng": 106.7305861,
        "lat": -6.1857875
      },
      {
        "lng": 106.7312834,
        "lat": -6.1882887
      },
      {
        "lng": 106.7319207,
        "lat": -6.1888485
      },
      {
        "lng": 106.7335365,
        "lat": -6.1898834
      },
      {
        "lng": 106.734824,
        "lat": -6.190966
      },
      {
        "lng": 106.7358486,
        "lat": -6.1913553
      },
      {
        "lng": 106.7365567,
        "lat": -6.191414
      },
      {
        "lng": 106.7367531,
        "lat": -6.1919236
      },
      {
        "lng": 106.7413498,
        "lat": -6.1919419
      },
      {
        "lng": 106.7414413,
        "lat": -6.1928641
      },
      {
        "lng": 106.7425192,
        "lat": -6.1928912
      },
      {
        "lng": 106.743517,
        "lat": -6.1935632
      },
      {
        "lng": 106.7439086,
        "lat": -6.1942725
      },
      {
        "lng": 106.7440129,
        "lat": -6.1946874
      },
      {
        "lng": 106.7443592,
        "lat": -6.197515
      },
      {
        "lng": 106.7478997,
        "lat": -6.1973657
      },
      {
        "lng": 106.7480545,
        "lat": -6.1992533
      },
      {
        "lng": 106.751054,
        "lat": -6.1994029
      },
      {
        "lng": 106.7512165,
        "lat": -6.2024704
      },
      {
        "lng": 106.7542387,
        "lat": -6.2071194
      },
      {
        "lng": 106.7576423,
        "lat": -6.2125039
      },
      {
        "lng": 106.7580278,
        "lat": -6.2131833
      },
      {
        "lng": 106.7579526,
        "lat": -6.2178123
      },
      {
        "lng": 106.7591973,
        "lat": -6.2176863
      },
      {
        "lng": 106.7605276,
        "lat": -6.217471
      },
      {
        "lng": 106.7639823,
        "lat": -6.2171297
      },
      {
        "lng": 106.7642711,
        "lat": -6.2179348
      },
      {
        "lng": 106.7645187,
        "lat": -6.2179989
      },
      {
        "lng": 106.7651463,
        "lat": -6.2194495
      },
      {
        "lng": 106.7650981,
        "lat": -6.2210707
      },
      {
        "lng": 106.767078,
        "lat": -6.2210415
      },
      {
        "lng": 106.7670778,
        "lat": -6.2215649
      },
      {
        "lng": 106.7675043,
        "lat": -6.2215836
      },
      {
        "lng": 106.7673997,
        "lat": -6.2234474
      },
      {
        "lng": 106.7688964,
        "lat": -6.2234074
      },
      {
        "lng": 106.7688669,
        "lat": -6.22397
      },
      {
        "lng": 106.7698456,
        "lat": -6.2239144
      },
      {
        "lng": 106.7716754,
        "lat": -6.2238938
      },
      {
        "lng": 106.7716298,
        "lat": -6.225075
      },
      {
        "lng": 106.7719731,
        "lat": -6.2258775
      },
      {
        "lng": 106.7719007,
        "lat": -6.2276
      },
      {
        "lng": 106.7717344,
        "lat": -6.2276187
      }
    ]
  },
  {
    "name": "JATAKE - MAXIMANGANDO",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5834498,
        "lat": -6.2143515
      },
      {
        "lng": 106.5836027,
        "lat": -6.2138289
      },
      {
        "lng": 106.5845093,
        "lat": -6.2140929
      },
      {
        "lng": 106.584799,
        "lat": -6.2142502
      },
      {
        "lng": 106.5851584,
        "lat": -6.2142582
      },
      {
        "lng": 106.5851852,
        "lat": -6.2133756
      },
      {
        "lng": 106.585152,
        "lat": -6.212766
      },
      {
        "lng": 106.5848419,
        "lat": -6.2113917
      },
      {
        "lng": 106.5847883,
        "lat": -6.2110851
      },
      {
        "lng": 106.5848124,
        "lat": -6.2107278
      },
      {
        "lng": 106.5848634,
        "lat": -6.2103998
      },
      {
        "lng": 106.5854987,
        "lat": -6.2104663
      },
      {
        "lng": 106.5874195,
        "lat": -6.2106611
      },
      {
        "lng": 106.5884012,
        "lat": -6.2107785
      },
      {
        "lng": 106.5883851,
        "lat": -6.2111811
      }
    ]
  },
  {
    "name": "Summarecon - Alam Sutera",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6563182,
        "lat": -6.2200679
      },
      {
        "lng": 106.6561921,
        "lat": -6.2199585
      },
      {
        "lng": 106.65583,
        "lat": -6.2204252
      },
      {
        "lng": 106.6553901,
        "lat": -6.2201159
      },
      {
        "lng": 106.655071,
        "lat": -6.2199639
      },
      {
        "lng": 106.6548939,
        "lat": -6.2199425
      },
      {
        "lng": 106.6544621,
        "lat": -6.2200065
      },
      {
        "lng": 106.6542847,
        "lat": -6.2200607
      },
      {
        "lng": 106.6535712,
        "lat": -6.2201615
      },
      {
        "lng": 106.6527115,
        "lat": -6.2203015
      },
      {
        "lng": 106.6517768,
        "lat": -6.2204548
      },
      {
        "lng": 106.6509198,
        "lat": -6.2205775
      },
      {
        "lng": 106.6502613,
        "lat": -6.2206468
      },
      {
        "lng": 106.6500488,
        "lat": -6.2206617
      },
      {
        "lng": 106.648999,
        "lat": -6.2208239
      },
      {
        "lng": 106.648779,
        "lat": -6.2208732
      },
      {
        "lng": 106.6486235,
        "lat": -6.2209345
      },
      {
        "lng": 106.6484585,
        "lat": -6.2210838
      },
      {
        "lng": 106.6484196,
        "lat": -6.2211892
      },
      {
        "lng": 106.6483686,
        "lat": -6.2218238
      },
      {
        "lng": 106.6480982,
        "lat": -6.2217073
      },
      {
        "lng": 106.6478581,
        "lat": -6.2216713
      },
      {
        "lng": 106.6472627,
        "lat": -6.2216473
      },
      {
        "lng": 106.6465988,
        "lat": -6.221774
      },
      {
        "lng": 106.6462758,
        "lat": -6.2219576
      },
      {
        "lng": 106.6452807,
        "lat": -6.2223319
      },
      {
        "lng": 106.6429847,
        "lat": -6.2232305
      },
      {
        "lng": 106.642377,
        "lat": -6.2234888
      },
      {
        "lng": 106.6419507,
        "lat": -6.2236691
      },
      {
        "lng": 106.6418663,
        "lat": -6.2237558
      },
      {
        "lng": 106.6417482,
        "lat": -6.2240184
      },
      {
        "lng": 106.6414814,
        "lat": -6.224261
      },
      {
        "lng": 106.6413714,
        "lat": -6.2243264
      },
      {
        "lng": 106.6406888,
        "lat": -6.2243077
      },
      {
        "lng": 106.6396735,
        "lat": -6.2246703
      },
      {
        "lng": 106.6383941,
        "lat": -6.225157
      },
      {
        "lng": 106.6381989,
        "lat": -6.2252923
      },
      {
        "lng": 106.6376783,
        "lat": -6.2255
      },
      {
        "lng": 106.6393196,
        "lat": -6.2273936
      },
      {
        "lng": 106.6395435,
        "lat": -6.2276392
      },
      {
        "lng": 106.6401497,
        "lat": -6.2285108
      },
      {
        "lng": 106.6407787,
        "lat": -6.2294174
      },
      {
        "lng": 106.6412776,
        "lat": -6.230156
      },
      {
        "lng": 106.6402946,
        "lat": -6.2305539
      },
      {
        "lng": 106.6399788,
        "lat": -6.230659
      },
      {
        "lng": 106.6388978,
        "lat": -6.2311193
      },
      {
        "lng": 106.6385491,
        "lat": -6.2311993
      },
      {
        "lng": 106.6380931,
        "lat": -6.2307194
      },
      {
        "lng": 106.6377015,
        "lat": -6.2302714
      },
      {
        "lng": 106.6369928,
        "lat": -6.229745
      },
      {
        "lng": 106.6365284,
        "lat": -6.2293829
      },
      {
        "lng": 106.6349821,
        "lat": -6.228499
      },
      {
        "lng": 106.6346924,
        "lat": -6.2283977
      },
      {
        "lng": 106.634443,
        "lat": -6.2288003
      },
      {
        "lng": 106.6341104,
        "lat": -6.2291709
      },
      {
        "lng": 106.633938,
        "lat": -6.2295645
      },
      {
        "lng": 106.6323963,
        "lat": -6.2335933
      },
      {
        "lng": 106.6318711,
        "lat": -6.2352065
      },
      {
        "lng": 106.630972,
        "lat": -6.2376488
      },
      {
        "lng": 106.6307824,
        "lat": -6.2379595
      },
      {
        "lng": 106.6326814,
        "lat": -6.2386901
      },
      {
        "lng": 106.6344731,
        "lat": -6.238931
      },
      {
        "lng": 106.6369086,
        "lat": -6.2392447
      },
      {
        "lng": 106.637445,
        "lat": -6.239426
      },
      {
        "lng": 106.6376918,
        "lat": -6.2398313
      },
      {
        "lng": 106.6379133,
        "lat": -6.2410092
      },
      {
        "lng": 106.6405675,
        "lat": -6.2430988
      },
      {
        "lng": 106.6407668,
        "lat": -6.2431434
      },
      {
        "lng": 106.6409304,
        "lat": -6.2431167
      },
      {
        "lng": 106.6411476,
        "lat": -6.2432553
      },
      {
        "lng": 106.6412066,
        "lat": -6.2433593
      },
      {
        "lng": 106.6419067,
        "lat": -6.2433513
      },
      {
        "lng": 106.6422768,
        "lat": -6.2433407
      },
      {
        "lng": 106.6425316,
        "lat": -6.243474
      },
      {
        "lng": 106.6426443,
        "lat": -6.243522
      },
      {
        "lng": 106.6429179,
        "lat": -6.24353
      },
      {
        "lng": 106.6431781,
        "lat": -6.243418
      }
    ]
  },
  {
    "name": "Curug - Summarecon",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6093187,
        "lat": -6.2422265
      },
      {
        "lng": 106.6094112,
        "lat": -6.2422412
      },
      {
        "lng": 106.6091859,
        "lat": -6.2432677
      },
      {
        "lng": 106.6098431,
        "lat": -6.243453
      },
      {
        "lng": 106.6111855,
        "lat": -6.2436643
      },
      {
        "lng": 106.6112284,
        "lat": -6.2440856
      },
      {
        "lng": 106.6110353,
        "lat": -6.2450348
      },
      {
        "lng": 106.6113706,
        "lat": -6.2450508
      },
      {
        "lng": 106.611612,
        "lat": -6.245097
      },
      {
        "lng": 106.6121578,
        "lat": -6.2451668
      },
      {
        "lng": 106.6127016,
        "lat": -6.2448988
      },
      {
        "lng": 106.6130851,
        "lat": -6.2445841
      },
      {
        "lng": 106.6135679,
        "lat": -6.2442029
      },
      {
        "lng": 106.6141205,
        "lat": -6.2439469
      },
      {
        "lng": 106.6147079,
        "lat": -6.2437363
      },
      {
        "lng": 106.6152014,
        "lat": -6.243203
      },
      {
        "lng": 106.6155662,
        "lat": -6.243075
      },
      {
        "lng": 106.616485,
        "lat": -6.243126
      },
      {
        "lng": 106.6183342,
        "lat": -6.2433896
      },
      {
        "lng": 106.6189297,
        "lat": -6.2433896
      },
      {
        "lng": 106.6202708,
        "lat": -6.2430537
      },
      {
        "lng": 106.6209628,
        "lat": -6.2428457
      },
      {
        "lng": 106.621432,
        "lat": -6.24283
      },
      {
        "lng": 106.6224219,
        "lat": -6.2425791
      },
      {
        "lng": 106.6230817,
        "lat": -6.2424671
      },
      {
        "lng": 106.6245569,
        "lat": -6.2426324
      },
      {
        "lng": 106.625613,
        "lat": -6.242863
      },
      {
        "lng": 106.6280063,
        "lat": -6.2432617
      },
      {
        "lng": 106.6285856,
        "lat": -6.2433416
      },
      {
        "lng": 106.6288109,
        "lat": -6.2432137
      },
      {
        "lng": 106.6290362,
        "lat": -6.2433416
      },
      {
        "lng": 106.6293635,
        "lat": -6.2434803
      },
      {
        "lng": 106.631177,
        "lat": -6.243496
      },
      {
        "lng": 106.6320087,
        "lat": -6.2435296
      },
      {
        "lng": 106.6326337,
        "lat": -6.2439669
      },
      {
        "lng": 106.6342752,
        "lat": -6.2453
      },
      {
        "lng": 106.634705,
        "lat": -6.245406
      },
      {
        "lng": 106.6363137,
        "lat": -6.2455347
      },
      {
        "lng": 106.6364853,
        "lat": -6.2454067
      },
      {
        "lng": 106.637889,
        "lat": -6.243186
      },
      {
        "lng": 106.6382315,
        "lat": -6.2424042
      },
      {
        "lng": 106.640725,
        "lat": -6.243173
      },
      {
        "lng": 106.6409352,
        "lat": -6.2431774
      },
      {
        "lng": 106.6411444,
        "lat": -6.2433427
      },
      {
        "lng": 106.6422655,
        "lat": -6.2432894
      },
      {
        "lng": 106.642625,
        "lat": -6.243476
      },
      {
        "lng": 106.6429056,
        "lat": -6.2434863
      },
      {
        "lng": 106.6429244,
        "lat": -6.2431663
      },
      {
        "lng": 106.643139,
        "lat": -6.2431637
      },
      {
        "lng": 106.643139,
        "lat": -6.2432117
      }
    ]
  },
  {
    "name": "Curug - Summarecon",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6093292,
        "lat": -6.2421517
      },
      {
        "lng": 106.6094432,
        "lat": -6.2421797
      },
      {
        "lng": 106.60919,
        "lat": -6.2433886
      },
      {
        "lng": 106.6098445,
        "lat": -6.2435753
      },
      {
        "lng": 106.61103,
        "lat": -6.2437512
      },
      {
        "lng": 106.6110247,
        "lat": -6.2445245
      },
      {
        "lng": 106.610853,
        "lat": -6.2451697
      },
      {
        "lng": 106.6114163,
        "lat": -6.245191
      },
      {
        "lng": 106.611803,
        "lat": -6.245195
      },
      {
        "lng": 106.6121887,
        "lat": -6.2452764
      },
      {
        "lng": 106.6127145,
        "lat": -6.2450204
      },
      {
        "lng": 106.6136586,
        "lat": -6.2443325
      },
      {
        "lng": 106.61471,
        "lat": -6.2438899
      },
      {
        "lng": 106.6152518,
        "lat": -6.243314
      },
      {
        "lng": 106.6156112,
        "lat": -6.243186
      },
      {
        "lng": 106.616915,
        "lat": -6.243258
      },
      {
        "lng": 106.618213,
        "lat": -6.2434686
      },
      {
        "lng": 106.6189211,
        "lat": -6.2434953
      },
      {
        "lng": 106.6209864,
        "lat": -6.2429727
      },
      {
        "lng": 106.6214746,
        "lat": -6.2429407
      },
      {
        "lng": 106.621805,
        "lat": -6.24278
      },
      {
        "lng": 106.6230785,
        "lat": -6.2425567
      },
      {
        "lng": 106.6245323,
        "lat": -6.2427221
      },
      {
        "lng": 106.6255944,
        "lat": -6.2429887
      },
      {
        "lng": 106.625858,
        "lat": -6.242946
      },
      {
        "lng": 106.6285717,
        "lat": -6.2434206
      },
      {
        "lng": 106.6288238,
        "lat": -6.243298
      },
      {
        "lng": 106.6293281,
        "lat": -6.2435326
      },
      {
        "lng": 106.631278,
        "lat": -6.2435303
      },
      {
        "lng": 106.631477,
        "lat": -6.243502
      },
      {
        "lng": 106.6319995,
        "lat": -6.2435116
      },
      {
        "lng": 106.6326111,
        "lat": -6.2439289
      },
      {
        "lng": 106.6335713,
        "lat": -6.2447088
      },
      {
        "lng": 106.6342794,
        "lat": -6.2452741
      },
      {
        "lng": 106.634934,
        "lat": -6.245455
      },
      {
        "lng": 106.6363098,
        "lat": -6.245562
      },
      {
        "lng": 106.6365029,
        "lat": -6.2454287
      },
      {
        "lng": 106.6372808,
        "lat": -6.2442022
      },
      {
        "lng": 106.6379218,
        "lat": -6.2431997
      },
      {
        "lng": 106.6381123,
        "lat": -6.2428291
      },
      {
        "lng": 106.638267,
        "lat": -6.242611
      },
      {
        "lng": 106.640725,
        "lat": -6.243173
      },
      {
        "lng": 106.6409205,
        "lat": -6.243213
      },
      {
        "lng": 106.641119,
        "lat": -6.243349
      },
      {
        "lng": 106.6422643,
        "lat": -6.2433143
      },
      {
        "lng": 106.6426345,
        "lat": -6.2434956
      },
      {
        "lng": 106.6429563,
        "lat": -6.243485
      },
      {
        "lng": 106.6429724,
        "lat": -6.2431197
      },
      {
        "lng": 106.6432112,
        "lat": -6.243125
      },
      {
        "lng": 106.6432138,
        "lat": -6.243205
      }
    ]
  },
  {
    "name": "Jalur Summarecon - Alam Sutera #2",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6563895,
        "lat": -6.2199971
      },
      {
        "lng": 106.6562903,
        "lat": -6.2199064
      },
      {
        "lng": 106.6558209,
        "lat": -6.220461
      },
      {
        "lng": 106.6553166,
        "lat": -6.2201277
      },
      {
        "lng": 106.6550806,
        "lat": -6.2200024
      },
      {
        "lng": 106.6548875,
        "lat": -6.2199784
      },
      {
        "lng": 106.6544905,
        "lat": -6.2200397
      },
      {
        "lng": 106.6543389,
        "lat": -6.2200515
      },
      {
        "lng": 106.653608,
        "lat": -6.2201917
      },
      {
        "lng": 106.652916,
        "lat": -6.2202984
      },
      {
        "lng": 106.6522428,
        "lat": -6.220413
      },
      {
        "lng": 106.6509044,
        "lat": -6.220613
      },
      {
        "lng": 106.6504792,
        "lat": -6.2206623
      },
      {
        "lng": 106.650103,
        "lat": -6.2206616
      },
      {
        "lng": 106.6490014,
        "lat": -6.2208397
      },
      {
        "lng": 106.6487881,
        "lat": -6.220885
      },
      {
        "lng": 106.6486366,
        "lat": -6.220949
      },
      {
        "lng": 106.6484797,
        "lat": -6.2210943
      },
      {
        "lng": 106.6484408,
        "lat": -6.221201
      },
      {
        "lng": 106.6483764,
        "lat": -6.2218516
      },
      {
        "lng": 106.6480974,
        "lat": -6.2217316
      },
      {
        "lng": 106.6478654,
        "lat": -6.2216982
      },
      {
        "lng": 106.64727,
        "lat": -6.2216716
      },
      {
        "lng": 106.6466102,
        "lat": -6.2217969
      },
      {
        "lng": 106.6463751,
        "lat": -6.2219482
      },
      {
        "lng": 106.6451028,
        "lat": -6.2224355
      },
      {
        "lng": 106.6439856,
        "lat": -6.2228675
      },
      {
        "lng": 106.6433365,
        "lat": -6.2231221
      },
      {
        "lng": 106.6430965,
        "lat": -6.2232128
      },
      {
        "lng": 106.6424764,
        "lat": -6.2234795
      },
      {
        "lng": 106.6421121,
        "lat": -6.2236247
      },
      {
        "lng": 106.6419726,
        "lat": -6.2236914
      },
      {
        "lng": 106.6418895,
        "lat": -6.2237767
      },
      {
        "lng": 106.6417755,
        "lat": -6.2240233
      },
      {
        "lng": 106.6415032,
        "lat": -6.2242753
      },
      {
        "lng": 106.6413812,
        "lat": -6.2243486
      },
      {
        "lng": 106.6406946,
        "lat": -6.2243287
      },
      {
        "lng": 106.6384106,
        "lat": -6.2251806
      },
      {
        "lng": 106.6382564,
        "lat": -6.2252792
      },
      {
        "lng": 106.6381267,
        "lat": -6.2253106
      },
      {
        "lng": 106.6376462,
        "lat": -6.2254912
      },
      {
        "lng": 106.6381223,
        "lat": -6.2260525
      },
      {
        "lng": 106.6393387,
        "lat": -6.2274417
      },
      {
        "lng": 106.6395345,
        "lat": -6.2276482
      },
      {
        "lng": 106.6405564,
        "lat": -6.2291321
      },
      {
        "lng": 106.6411063,
        "lat": -6.2299414
      },
      {
        "lng": 106.641235,
        "lat": -6.230136
      },
      {
        "lng": 106.6402641,
        "lat": -6.2305373
      },
      {
        "lng": 106.6399892,
        "lat": -6.2306778
      },
      {
        "lng": 106.6389203,
        "lat": -6.2311359
      },
      {
        "lng": 106.6385582,
        "lat": -6.2312226
      },
      {
        "lng": 106.6385407,
        "lat": -6.2312252
      },
      {
        "lng": 106.6380231,
        "lat": -6.230672
      },
      {
        "lng": 106.6376932,
        "lat": -6.2302987
      },
      {
        "lng": 106.6369838,
        "lat": -6.229754
      },
      {
        "lng": 106.6365291,
        "lat": -6.2294041
      },
      {
        "lng": 106.6349761,
        "lat": -6.2285135
      },
      {
        "lng": 106.6347012,
        "lat": -6.2284176
      },
      {
        "lng": 106.6344705,
        "lat": -6.2287975
      },
      {
        "lng": 106.6341272,
        "lat": -6.2291815
      },
      {
        "lng": 106.6340282,
        "lat": -6.2294919
      },
      {
        "lng": 106.6326546,
        "lat": -6.2330317
      },
      {
        "lng": 106.6325554,
        "lat": -6.2333223
      },
      {
        "lng": 106.6325339,
        "lat": -6.2334237
      },
      {
        "lng": 106.6325487,
        "lat": -6.2334836
      },
      {
        "lng": 106.6325677,
        "lat": -6.2335023
      },
      {
        "lng": 106.63231,
        "lat": -6.2340969
      },
      {
        "lng": 106.6322067,
        "lat": -6.2343609
      },
      {
        "lng": 106.6320444,
        "lat": -6.2348275
      },
      {
        "lng": 106.6318567,
        "lat": -6.2353501
      },
      {
        "lng": 106.6311378,
        "lat": -6.2374538
      },
      {
        "lng": 106.6310893,
        "lat": -6.2375942
      },
      {
        "lng": 106.6308844,
        "lat": -6.2379324
      },
      {
        "lng": 106.6308158,
        "lat": -6.2380609
      },
      {
        "lng": 106.6326343,
        "lat": -6.2387595
      },
      {
        "lng": 106.6345006,
        "lat": -6.2390576
      },
      {
        "lng": 106.6368722,
        "lat": -6.2393407
      },
      {
        "lng": 106.6373657,
        "lat": -6.2395114
      },
      {
        "lng": 106.6375588,
        "lat": -6.2398526
      },
      {
        "lng": 106.6376661,
        "lat": -6.2402366
      },
      {
        "lng": 106.6377412,
        "lat": -6.2406952
      },
      {
        "lng": 106.6378684,
        "lat": -6.2410998
      },
      {
        "lng": 106.6406036,
        "lat": -6.2430987
      },
      {
        "lng": 106.6407645,
        "lat": -6.2431174
      },
      {
        "lng": 106.6409241,
        "lat": -6.2430934
      },
      {
        "lng": 106.6410891,
        "lat": -6.2431707
      },
      {
        "lng": 106.6411494,
        "lat": -6.2432294
      },
      {
        "lng": 106.6412111,
        "lat": -6.243316
      },
      {
        "lng": 106.6422572,
        "lat": -6.2432694
      },
      {
        "lng": 106.6426287,
        "lat": -6.2434547
      },
      {
        "lng": 106.6428875,
        "lat": -6.2434707
      },
      {
        "lng": 106.6429331,
        "lat": -6.243468
      },
      {
        "lng": 106.6429532,
        "lat": -6.2430814
      },
      {
        "lng": 106.643263,
        "lat": -6.2430907
      },
      {
        "lng": 106.643263,
        "lat": -6.2431987
      }
    ]
  },
  {
    "name": "Alam Sutera - Ciledug #2",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.656356,
        "lat": -6.2198859
      },
      {
        "lng": 106.6558973,
        "lat": -6.2205205
      },
      {
        "lng": 106.6565276,
        "lat": -6.2208911
      },
      {
        "lng": 106.6568012,
        "lat": -6.2208965
      },
      {
        "lng": 106.6570694,
        "lat": -6.2206965
      },
      {
        "lng": 106.657461,
        "lat": -6.2206512
      },
      {
        "lng": 106.657807,
        "lat": -6.2207898
      },
      {
        "lng": 106.6580887,
        "lat": -6.2210431
      },
      {
        "lng": 106.6588307,
        "lat": -6.2209782
      },
      {
        "lng": 106.6604168,
        "lat": -6.2209578
      },
      {
        "lng": 106.6613288,
        "lat": -6.2208565
      },
      {
        "lng": 106.6616024,
        "lat": -6.2208725
      },
      {
        "lng": 106.6627778,
        "lat": -6.2207222
      },
      {
        "lng": 106.6640163,
        "lat": -6.2205525
      },
      {
        "lng": 106.6644535,
        "lat": -6.2207472
      },
      {
        "lng": 106.6653145,
        "lat": -6.2210725
      },
      {
        "lng": 106.6659291,
        "lat": -6.2210742
      },
      {
        "lng": 106.6663583,
        "lat": -6.2209809
      },
      {
        "lng": 106.6664458,
        "lat": -6.2209235
      },
      {
        "lng": 106.6670744,
        "lat": -6.2206583
      },
      {
        "lng": 106.667112,
        "lat": -6.220237
      },
      {
        "lng": 106.6669323,
        "lat": -6.2197677
      },
      {
        "lng": 106.6669242,
        "lat": -6.2197383
      },
      {
        "lng": 106.6671603,
        "lat": -6.2195784
      },
      {
        "lng": 106.6679596,
        "lat": -6.2195997
      },
      {
        "lng": 106.6687776,
        "lat": -6.2191224
      },
      {
        "lng": 106.669019,
        "lat": -6.2187491
      },
      {
        "lng": 106.6691478,
        "lat": -6.2181118
      },
      {
        "lng": 106.6691667,
        "lat": -6.2179722
      },
      {
        "lng": 106.6697781,
        "lat": -6.2175305
      },
      {
        "lng": 106.6710173,
        "lat": -6.2177359
      },
      {
        "lng": 106.6713257,
        "lat": -6.2175065
      },
      {
        "lng": 106.6715752,
        "lat": -6.2170053
      },
      {
        "lng": 106.6718863,
        "lat": -6.2168373
      },
      {
        "lng": 106.6725,
        "lat": -6.2166944
      },
      {
        "lng": 106.6766124,
        "lat": -6.2155964
      },
      {
        "lng": 106.6766509,
        "lat": -6.2155865
      },
      {
        "lng": 106.679405,
        "lat": -6.2147885
      },
      {
        "lng": 106.6798414,
        "lat": -6.2146776
      },
      {
        "lng": 106.6798691,
        "lat": -6.2146658
      },
      {
        "lng": 106.680195,
        "lat": -6.2144685
      },
      {
        "lng": 106.6801333,
        "lat": -6.2134019
      },
      {
        "lng": 106.6802097,
        "lat": -6.2128686
      },
      {
        "lng": 106.6800772,
        "lat": -6.2122741
      },
      {
        "lng": 106.6799994,
        "lat": -6.2122261
      },
      {
        "lng": 106.6799752,
        "lat": -6.2122261
      },
      {
        "lng": 106.6798974,
        "lat": -6.2122181
      },
      {
        "lng": 106.6798089,
        "lat": -6.2122314
      },
      {
        "lng": 106.6796185,
        "lat": -6.2117061
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5544995,
        "lat": -6.1825912
      },
      {
        "lng": 106.5543695,
        "lat": -6.1826072
      },
      {
        "lng": 106.5542863,
        "lat": -6.1823512
      },
      {
        "lng": 106.5541629,
        "lat": -6.1823966
      },
      {
        "lng": 106.5539698,
        "lat": -6.1825406
      },
      {
        "lng": 106.5538759,
        "lat": -6.1826739
      },
      {
        "lng": 106.5537928,
        "lat": -6.1826686
      },
      {
        "lng": 106.553825,
        "lat": -6.1822153
      },
      {
        "lng": 106.5538438,
        "lat": -6.1819433
      },
      {
        "lng": 106.5538757,
        "lat": -6.181378
      },
      {
        "lng": 106.5539347,
        "lat": -6.1806686
      },
      {
        "lng": 106.5540248,
        "lat": -6.1797626
      },
      {
        "lng": 106.554088,
        "lat": -6.1791659
      },
      {
        "lng": 106.5541591,
        "lat": -6.1781472
      },
      {
        "lng": 106.5520059,
        "lat": -6.1778859
      },
      {
        "lng": 106.5519451,
        "lat": -6.1778419
      },
      {
        "lng": 106.5519593,
        "lat": -6.1777019
      },
      {
        "lng": 106.5520299,
        "lat": -6.1772846
      },
      {
        "lng": 106.5520261,
        "lat": -6.177191
      },
      {
        "lng": 106.5519633,
        "lat": -6.1771453
      },
      {
        "lng": 106.5517073,
        "lat": -6.1771256
      },
      {
        "lng": 106.5515693,
        "lat": -6.177066
      },
      {
        "lng": 106.5515535,
        "lat": -6.1768853
      },
      {
        "lng": 106.5516472,
        "lat": -6.1731995
      },
      {
        "lng": 106.551698,
        "lat": -6.1723297
      },
      {
        "lng": 106.5516739,
        "lat": -6.1719884
      },
      {
        "lng": 106.5488106,
        "lat": -6.1721377
      },
      {
        "lng": 106.5487826,
        "lat": -6.1705039
      },
      {
        "lng": 106.5489847,
        "lat": -6.1659711
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5545271,
        "lat": -6.1827079
      },
      {
        "lng": 106.5543555,
        "lat": -6.1827479
      },
      {
        "lng": 106.5541409,
        "lat": -6.1825226
      },
      {
        "lng": 106.5540229,
        "lat": -6.1825972
      },
      {
        "lng": 106.5538995,
        "lat": -6.1827306
      },
      {
        "lng": 106.5538351,
        "lat": -6.1826026
      },
      {
        "lng": 106.5539263,
        "lat": -6.1811039
      },
      {
        "lng": 106.5540175,
        "lat": -6.1804106
      },
      {
        "lng": 106.554039,
        "lat": -6.18
      },
      {
        "lng": 106.5540802,
        "lat": -6.1794943
      },
      {
        "lng": 106.5542106,
        "lat": -6.1781173
      },
      {
        "lng": 106.5520327,
        "lat": -6.1778453
      },
      {
        "lng": 106.5520756,
        "lat": -6.177248
      },
      {
        "lng": 106.5520488,
        "lat": -6.1771573
      },
      {
        "lng": 106.55166,
        "lat": -6.1769798
      },
      {
        "lng": 106.5515981,
        "lat": -6.1768213
      },
      {
        "lng": 106.5516572,
        "lat": -6.17408
      },
      {
        "lng": 106.5517054,
        "lat": -6.1727467
      },
      {
        "lng": 106.5517187,
        "lat": -6.1725287
      },
      {
        "lng": 106.5517376,
        "lat": -6.17232
      },
      {
        "lng": 106.5517054,
        "lat": -6.1719414
      },
      {
        "lng": 106.5488623,
        "lat": -6.1720907
      },
      {
        "lng": 106.5487657,
        "lat": -6.1721014
      },
      {
        "lng": 106.5487389,
        "lat": -6.1709654
      },
      {
        "lng": 106.5486879,
        "lat": -6.1707133
      },
      {
        "lng": 106.5487389,
        "lat": -6.169968
      },
      {
        "lng": 106.5486423,
        "lat": -6.1692267
      },
      {
        "lng": 106.548578,
        "lat": -6.1683467
      },
      {
        "lng": 106.5485619,
        "lat": -6.16712
      },
      {
        "lng": 106.5485297,
        "lat": -6.166592
      },
      {
        "lng": 106.5485351,
        "lat": -6.1661547
      },
      {
        "lng": 106.5489847,
        "lat": -6.1659711
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7717338,
        "lat": -6.2276427
      },
      {
        "lng": 106.7719041,
        "lat": -6.2276253
      },
      {
        "lng": 106.7719015,
        "lat": -6.2278626
      },
      {
        "lng": 106.7719015,
        "lat": -6.2282066
      },
      {
        "lng": 106.7719041,
        "lat": -6.2285172
      },
      {
        "lng": 106.7719122,
        "lat": -6.2288372
      },
      {
        "lng": 106.7719108,
        "lat": -6.2292932
      },
      {
        "lng": 106.7718974,
        "lat": -6.2297811
      },
      {
        "lng": 106.7718894,
        "lat": -6.2302704
      },
      {
        "lng": 106.771884,
        "lat": -6.2306677
      },
      {
        "lng": 106.7718827,
        "lat": -6.230965
      },
      {
        "lng": 106.7718758,
        "lat": -6.231217
      },
      {
        "lng": 106.7718867,
        "lat": -6.2319249
      },
      {
        "lng": 106.7718693,
        "lat": -6.2322368
      },
      {
        "lng": 106.7718732,
        "lat": -6.2328474
      },
      {
        "lng": 106.7718785,
        "lat": -6.2336793
      },
      {
        "lng": 106.7719295,
        "lat": -6.2341966
      },
      {
        "lng": 106.7719617,
        "lat": -6.2348712
      },
      {
        "lng": 106.7719778,
        "lat": -6.2351432
      },
      {
        "lng": 106.7719366,
        "lat": -6.2358824
      },
      {
        "lng": 106.7719375,
        "lat": -6.236671
      },
      {
        "lng": 106.7719885,
        "lat": -6.2373189
      },
      {
        "lng": 106.7720155,
        "lat": -6.2381309
      },
      {
        "lng": 106.770535,
        "lat": -6.2380776
      },
      {
        "lng": 106.7693778,
        "lat": -6.2380611
      },
      {
        "lng": 106.7673485,
        "lat": -6.2379603
      },
      {
        "lng": 106.7649767,
        "lat": -6.2378589
      },
      {
        "lng": 106.764044,
        "lat": -6.2378643
      },
      {
        "lng": 106.7636041,
        "lat": -6.2381736
      },
      {
        "lng": 106.7634539,
        "lat": -6.2386108
      },
      {
        "lng": 106.7634003,
        "lat": -6.2395174
      },
      {
        "lng": 106.7628424,
        "lat": -6.2399547
      },
      {
        "lng": 106.7628634,
        "lat": -6.240877
      },
      {
        "lng": 106.7629578,
        "lat": -6.2417993
      },
      {
        "lng": 106.7630383,
        "lat": -6.2423539
      },
      {
        "lng": 106.7629846,
        "lat": -6.2428232
      },
      {
        "lng": 106.7629364,
        "lat": -6.2430312
      },
      {
        "lng": 106.7630437,
        "lat": -6.2436071
      },
      {
        "lng": 106.7632314,
        "lat": -6.2442897
      },
      {
        "lng": 106.7628211,
        "lat": -6.2451443
      },
      {
        "lng": 106.7628117,
        "lat": -6.2451723
      },
      {
        "lng": 106.7628787,
        "lat": -6.245231
      },
      {
        "lng": 106.7629136,
        "lat": -6.245383
      },
      {
        "lng": 106.7629351,
        "lat": -6.2454616
      },
      {
        "lng": 106.7631107,
        "lat": -6.245415
      },
      {
        "lng": 106.7630853,
        "lat": -6.2453403
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7753515,
        "lat": -6.1873998
      },
      {
        "lng": 106.7752604,
        "lat": -6.1874371
      },
      {
        "lng": 106.7753328,
        "lat": -6.1876531
      },
      {
        "lng": 106.7753703,
        "lat": -6.1877651
      },
      {
        "lng": 106.7760784,
        "lat": -6.1874798
      },
      {
        "lng": 106.7770413,
        "lat": -6.1871198
      },
      {
        "lng": 106.7776717,
        "lat": -6.1868905
      },
      {
        "lng": 106.7782912,
        "lat": -6.1866531
      },
      {
        "lng": 106.7791227,
        "lat": -6.1863492
      },
      {
        "lng": 106.779811,
        "lat": -6.186089
      },
      {
        "lng": 106.7810298,
        "lat": -6.1857198
      },
      {
        "lng": 106.7818505,
        "lat": -6.1854212
      },
      {
        "lng": 106.7824205,
        "lat": -6.1852653
      },
      {
        "lng": 106.7830293,
        "lat": -6.1851293
      },
      {
        "lng": 106.7832772,
        "lat": -6.1850746
      },
      {
        "lng": 106.7833228,
        "lat": -6.1850693
      },
      {
        "lng": 106.7833416,
        "lat": -6.1846773
      },
      {
        "lng": 106.7833523,
        "lat": -6.1843199
      },
      {
        "lng": 106.783363,
        "lat": -6.1841733
      },
      {
        "lng": 106.7834356,
        "lat": -6.1838977
      },
      {
        "lng": 106.783532,
        "lat": -6.1831013
      },
      {
        "lng": 106.7836232,
        "lat": -6.18228
      },
      {
        "lng": 106.7837251,
        "lat": -6.1813467
      },
      {
        "lng": 106.7837251,
        "lat": -6.180296
      },
      {
        "lng": 106.78365,
        "lat": -6.179528
      },
      {
        "lng": 106.7836365,
        "lat": -6.1791229
      },
      {
        "lng": 106.7835891,
        "lat": -6.177306
      },
      {
        "lng": 106.7835569,
        "lat": -6.1760046
      },
      {
        "lng": 106.7835211,
        "lat": -6.1743491
      },
      {
        "lng": 106.7834982,
        "lat": -6.1737576
      },
      {
        "lng": 106.7842305,
        "lat": -6.1737496
      },
      {
        "lng": 106.7850485,
        "lat": -6.1737549
      },
      {
        "lng": 106.7863521,
        "lat": -6.1737389
      },
      {
        "lng": 106.7869985,
        "lat": -6.1737229
      },
      {
        "lng": 106.7875393,
        "lat": -6.1737027
      },
      {
        "lng": 106.7887229,
        "lat": -6.1736868
      },
      {
        "lng": 106.7890018,
        "lat": -6.1736442
      },
      {
        "lng": 106.7891896,
        "lat": -6.1735962
      },
      {
        "lng": 106.7892915,
        "lat": -6.1735002
      },
      {
        "lng": 106.7893183,
        "lat": -6.1733508
      },
      {
        "lng": 106.7889858,
        "lat": -6.1728175
      },
      {
        "lng": 106.7883186,
        "lat": -6.1717018
      },
      {
        "lng": 106.7880792,
        "lat": -6.1711535
      },
      {
        "lng": 106.78787,
        "lat": -6.1706042
      },
      {
        "lng": 106.7877305,
        "lat": -6.1700388
      },
      {
        "lng": 106.7876232,
        "lat": -6.1689988
      },
      {
        "lng": 106.7876071,
        "lat": -6.1678575
      },
      {
        "lng": 106.7876071,
        "lat": -6.1675588
      },
      {
        "lng": 106.7875213,
        "lat": -6.1675028
      },
      {
        "lng": 106.7873925,
        "lat": -6.1674495
      },
      {
        "lng": 106.7872562,
        "lat": -6.1674195
      },
      {
        "lng": 106.7867273,
        "lat": -6.1674361
      },
      {
        "lng": 106.7863652,
        "lat": -6.1674521
      },
      {
        "lng": 106.7857912,
        "lat": -6.1675135
      },
      {
        "lng": 106.7853514,
        "lat": -6.1675508
      },
      {
        "lng": 106.7850027,
        "lat": -6.1675402
      },
      {
        "lng": 106.7845842,
        "lat": -6.1674388
      },
      {
        "lng": 106.7840854,
        "lat": -6.1672575
      },
      {
        "lng": 106.7835489,
        "lat": -6.1670415
      },
      {
        "lng": 106.7834282,
        "lat": -6.1669935
      },
      {
        "lng": 106.7836052,
        "lat": -6.1665188
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7073759,
        "lat": -6.1975095
      },
      {
        "lng": 106.7073279,
        "lat": -6.1976788
      },
      {
        "lng": 106.7074352,
        "lat": -6.1977748
      },
      {
        "lng": 106.7075854,
        "lat": -6.1979508
      },
      {
        "lng": 106.7078376,
        "lat": -6.1982921
      },
      {
        "lng": 106.7082023,
        "lat": -6.1985427
      },
      {
        "lng": 106.7085189,
        "lat": -6.1986387
      },
      {
        "lng": 106.7088085,
        "lat": -6.1987187
      },
      {
        "lng": 106.7090499,
        "lat": -6.1986761
      },
      {
        "lng": 106.7092216,
        "lat": -6.1985907
      },
      {
        "lng": 106.7094952,
        "lat": -6.1983348
      },
      {
        "lng": 106.7096883,
        "lat": -6.1982068
      },
      {
        "lng": 106.7099082,
        "lat": -6.1981748
      },
      {
        "lng": 106.710037,
        "lat": -6.1981908
      },
      {
        "lng": 106.710155,
        "lat": -6.1981054
      },
      {
        "lng": 106.7104232,
        "lat": -6.1978974
      },
      {
        "lng": 106.7105412,
        "lat": -6.1978068
      },
      {
        "lng": 106.7106539,
        "lat": -6.1979294
      }
    ]
  },
  {
    "name": "SKTT Metland - Kembangan #1",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.707296,
        "lat": -6.197452
      },
      {
        "lng": 106.7072964,
        "lat": -6.1975728
      },
      {
        "lng": 106.7073849,
        "lat": -6.1976714
      },
      {
        "lng": 106.7075351,
        "lat": -6.1978394
      },
      {
        "lng": 106.7076853,
        "lat": -6.1980021
      },
      {
        "lng": 106.7078758,
        "lat": -6.1982661
      },
      {
        "lng": 106.7082191,
        "lat": -6.1984981
      },
      {
        "lng": 106.708777,
        "lat": -6.1986687
      },
      {
        "lng": 106.7090425,
        "lat": -6.1986474
      },
      {
        "lng": 106.7092169,
        "lat": -6.1985461
      },
      {
        "lng": 106.7093859,
        "lat": -6.1983807
      },
      {
        "lng": 106.7095227,
        "lat": -6.1982687
      },
      {
        "lng": 106.7096702,
        "lat": -6.1981674
      },
      {
        "lng": 106.7099169,
        "lat": -6.1981407
      },
      {
        "lng": 106.7100484,
        "lat": -6.1981541
      },
      {
        "lng": 106.7103488,
        "lat": -6.1979221
      },
      {
        "lng": 106.7106358,
        "lat": -6.1976981
      },
      {
        "lng": 106.7107591,
        "lat": -6.1978341
      }
    ]
  },
  {
    "name": "SKTT CIledug - Metland #1",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.706661,
        "lat": -6.197412
      },
      {
        "lng": 106.7070259,
        "lat": -6.197606
      },
      {
        "lng": 106.7073316,
        "lat": -6.1977873
      },
      {
        "lng": 106.7075757,
        "lat": -6.1980486
      },
      {
        "lng": 106.7077635,
        "lat": -6.1983073
      },
      {
        "lng": 106.7080371,
        "lat": -6.1985579
      },
      {
        "lng": 106.7083697,
        "lat": -6.1986966
      },
      {
        "lng": 106.7087935,
        "lat": -6.1987952
      },
      {
        "lng": 106.709059,
        "lat": -6.1987632
      },
      {
        "lng": 106.709228,
        "lat": -6.1986592
      },
      {
        "lng": 106.7094291,
        "lat": -6.1984886
      },
      {
        "lng": 106.7096679,
        "lat": -6.1982886
      },
      {
        "lng": 106.7098046,
        "lat": -6.1982673
      },
      {
        "lng": 106.71003,
        "lat": -6.1982673
      },
      {
        "lng": 106.7101399,
        "lat": -6.1982193
      },
      {
        "lng": 106.7107139,
        "lat": -6.197734
      },
      {
        "lng": 106.7107837,
        "lat": -6.1978059
      }
    ]
  },
  {
    "name": "SKTT CILEDUG - METLAND #2",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.706784,
        "lat": -6.197419
      },
      {
        "lng": 106.7073078,
        "lat": -6.1978205
      },
      {
        "lng": 106.7075546,
        "lat": -6.1980685
      },
      {
        "lng": 106.7077423,
        "lat": -6.1983245
      },
      {
        "lng": 106.7080213,
        "lat": -6.1985805
      },
      {
        "lng": 106.7083592,
        "lat": -6.1987164
      },
      {
        "lng": 106.7087991,
        "lat": -6.1988204
      },
      {
        "lng": 106.70907,
        "lat": -6.1987858
      },
      {
        "lng": 106.7092631,
        "lat": -6.1986791
      },
      {
        "lng": 106.709695,
        "lat": -6.1983165
      },
      {
        "lng": 106.7098237,
        "lat": -6.1982898
      },
      {
        "lng": 106.7100463,
        "lat": -6.1982925
      },
      {
        "lng": 106.7101563,
        "lat": -6.1982391
      },
      {
        "lng": 106.7106471,
        "lat": -6.1978285
      },
      {
        "lng": 106.7106927,
        "lat": -6.1978792
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7073759,
        "lat": -6.1975095
      },
      {
        "lng": 106.7075823,
        "lat": -6.197206
      },
      {
        "lng": 106.7078961,
        "lat": -6.1967153
      },
      {
        "lng": 106.7079819,
        "lat": -6.1966113
      },
      {
        "lng": 106.7080785,
        "lat": -6.1965633
      },
      {
        "lng": 106.7081613,
        "lat": -6.1964516
      },
      {
        "lng": 106.7087839,
        "lat": -6.1958674
      },
      {
        "lng": 106.7088751,
        "lat": -6.1958087
      },
      {
        "lng": 106.7089448,
        "lat": -6.19567
      },
      {
        "lng": 106.708969,
        "lat": -6.1955287
      },
      {
        "lng": 106.7091272,
        "lat": -6.1952327
      },
      {
        "lng": 106.7093633,
        "lat": -6.1946674
      },
      {
        "lng": 106.7094249,
        "lat": -6.1945367
      },
      {
        "lng": 106.7095,
        "lat": -6.1944274
      },
      {
        "lng": 106.7097173,
        "lat": -6.1939661
      },
      {
        "lng": 106.7100258,
        "lat": -6.1933715
      },
      {
        "lng": 106.7102859,
        "lat": -6.1929235
      },
      {
        "lng": 106.7104388,
        "lat": -6.1925102
      },
      {
        "lng": 106.7109323,
        "lat": -6.1915049
      },
      {
        "lng": 106.7112436,
        "lat": -6.1908012
      },
      {
        "lng": 106.711568,
        "lat": -6.1901263
      },
      {
        "lng": 106.7117853,
        "lat": -6.1896623
      },
      {
        "lng": 106.7120079,
        "lat": -6.1892276
      },
      {
        "lng": 106.7120776,
        "lat": -6.1891956
      },
      {
        "lng": 106.7126704,
        "lat": -6.1894783
      },
      {
        "lng": 106.7129673,
        "lat": -6.189565
      },
      {
        "lng": 106.7131425,
        "lat": -6.1896996
      },
      {
        "lng": 106.7135341,
        "lat": -6.1898756
      },
      {
        "lng": 106.7136199,
        "lat": -6.1899316
      },
      {
        "lng": 106.7139203,
        "lat": -6.1901503
      },
      {
        "lng": 106.7141993,
        "lat": -6.1903156
      },
      {
        "lng": 106.7145944,
        "lat": -6.1904228
      },
      {
        "lng": 106.7147974,
        "lat": -6.1904782
      },
      {
        "lng": 106.714902,
        "lat": -6.1904542
      },
      {
        "lng": 106.7151863,
        "lat": -6.1906622
      },
      {
        "lng": 106.7153178,
        "lat": -6.1907342
      },
      {
        "lng": 106.715814,
        "lat": -6.1909156
      },
      {
        "lng": 106.7160741,
        "lat": -6.1909849
      },
      {
        "lng": 106.7162753,
        "lat": -6.1910062
      },
      {
        "lng": 106.7164657,
        "lat": -6.1910009
      },
      {
        "lng": 106.7166186,
        "lat": -6.1909262
      },
      {
        "lng": 106.7166294,
        "lat": -6.1908409
      },
      {
        "lng": 106.7167098,
        "lat": -6.1906862
      },
      {
        "lng": 106.716801,
        "lat": -6.1903742
      },
      {
        "lng": 106.7167906,
        "lat": -6.1902311
      },
      {
        "lng": 106.7168627,
        "lat": -6.1899956
      },
      {
        "lng": 106.7168953,
        "lat": -6.1898949
      },
      {
        "lng": 106.7169552,
        "lat": -6.1898303
      },
      {
        "lng": 106.7170908,
        "lat": -6.1894512
      },
      {
        "lng": 106.717135,
        "lat": -6.1893743
      },
      {
        "lng": 106.7171779,
        "lat": -6.1892583
      },
      {
        "lng": 106.7173093,
        "lat": -6.1890143
      },
      {
        "lng": 106.7173522,
        "lat": -6.188921
      },
      {
        "lng": 106.7174032,
        "lat": -6.1888356
      },
      {
        "lng": 106.7174756,
        "lat": -6.188665
      },
      {
        "lng": 106.717776,
        "lat": -6.188373
      },
      {
        "lng": 106.7179895,
        "lat": -6.1881915
      },
      {
        "lng": 106.7182306,
        "lat": -6.188085
      },
      {
        "lng": 106.7184197,
        "lat": -6.188029
      },
      {
        "lng": 106.7188666,
        "lat": -6.1879328
      },
      {
        "lng": 106.7190152,
        "lat": -6.1879197
      },
      {
        "lng": 106.7191885,
        "lat": -6.1878342
      },
      {
        "lng": 106.719572,
        "lat": -6.1877408
      },
      {
        "lng": 106.7196763,
        "lat": -6.1877063
      },
      {
        "lng": 106.7196965,
        "lat": -6.187761
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.706784,
        "lat": -6.197419
      },
      {
        "lng": 106.706542,
        "lat": -6.1973027
      },
      {
        "lng": 106.7063858,
        "lat": -6.1972701
      },
      {
        "lng": 106.7061719,
        "lat": -6.197228
      },
      {
        "lng": 106.7058613,
        "lat": -6.1972456
      },
      {
        "lng": 106.7055743,
        "lat": -6.1972936
      },
      {
        "lng": 106.705276,
        "lat": -6.1973667
      },
      {
        "lng": 106.7049144,
        "lat": -6.1975976
      },
      {
        "lng": 106.7045157,
        "lat": -6.1979101
      },
      {
        "lng": 106.7043753,
        "lat": -6.1979869
      },
      {
        "lng": 106.7042595,
        "lat": -6.198
      },
      {
        "lng": 106.7039784,
        "lat": -6.1982136
      },
      {
        "lng": 106.7036801,
        "lat": -6.1981093
      },
      {
        "lng": 106.7035755,
        "lat": -6.19792
      },
      {
        "lng": 106.7033936,
        "lat": -6.1976856
      },
      {
        "lng": 106.7032939,
        "lat": -6.1975227
      },
      {
        "lng": 106.7031871,
        "lat": -6.197419
      },
      {
        "lng": 106.7029377,
        "lat": -6.1970937
      },
      {
        "lng": 106.7028433,
        "lat": -6.1969707
      },
      {
        "lng": 106.7027467,
        "lat": -6.1968747
      },
      {
        "lng": 106.7025616,
        "lat": -6.196648
      },
      {
        "lng": 106.7023234,
        "lat": -6.1963337
      },
      {
        "lng": 106.7021142,
        "lat": -6.1960057
      },
      {
        "lng": 106.7019716,
        "lat": -6.1957201
      },
      {
        "lng": 106.7018058,
        "lat": -6.1954084
      },
      {
        "lng": 106.7017119,
        "lat": -6.1951284
      },
      {
        "lng": 106.7016967,
        "lat": -6.1950708
      },
      {
        "lng": 106.7016229,
        "lat": -6.1948268
      },
      {
        "lng": 106.7015531,
        "lat": -6.1947921
      },
      {
        "lng": 106.7014866,
        "lat": -6.1948058
      },
      {
        "lng": 106.7010167,
        "lat": -6.1949361
      },
      {
        "lng": 106.7005983,
        "lat": -6.1950855
      },
      {
        "lng": 106.7001611,
        "lat": -6.1952374
      },
      {
        "lng": 106.7001021,
        "lat": -6.1952801
      },
      {
        "lng": 106.6999733,
        "lat": -6.1953441
      },
      {
        "lng": 106.6998928,
        "lat": -6.1954881
      },
      {
        "lng": 106.6998699,
        "lat": -6.1955448
      },
      {
        "lng": 106.6998022,
        "lat": -6.1957084
      },
      {
        "lng": 106.6997373,
        "lat": -6.1958827
      },
      {
        "lng": 106.6996595,
        "lat": -6.1960107
      },
      {
        "lng": 106.6996246,
        "lat": -6.1960907
      },
      {
        "lng": 106.6995495,
        "lat": -6.1961841
      },
      {
        "lng": 106.6994235,
        "lat": -6.1964694
      },
      {
        "lng": 106.6993671,
        "lat": -6.196632
      },
      {
        "lng": 106.6993636,
        "lat": -6.196867
      },
      {
        "lng": 106.6993135,
        "lat": -6.197312
      },
      {
        "lng": 106.6992899,
        "lat": -6.1974163
      },
      {
        "lng": 106.6992491,
        "lat": -6.197544
      },
      {
        "lng": 106.6992112,
        "lat": -6.1976468
      },
      {
        "lng": 106.6992142,
        "lat": -6.1977307
      },
      {
        "lng": 106.6991982,
        "lat": -6.1978853
      },
      {
        "lng": 106.6991096,
        "lat": -6.1982266
      },
      {
        "lng": 106.698909,
        "lat": -6.1987296
      },
      {
        "lng": 106.6988272,
        "lat": -6.1989176
      },
      {
        "lng": 106.6987682,
        "lat": -6.1990242
      },
      {
        "lng": 106.698677,
        "lat": -6.1992615
      },
      {
        "lng": 106.6986126,
        "lat": -6.1993549
      },
      {
        "lng": 106.6985804,
        "lat": -6.1994469
      },
      {
        "lng": 106.6984058,
        "lat": -6.1997565
      },
      {
        "lng": 106.6982916,
        "lat": -6.1998932
      },
      {
        "lng": 106.698221,
        "lat": -6.1999135
      },
      {
        "lng": 106.6981204,
        "lat": -6.1999082
      },
      {
        "lng": 106.6978088,
        "lat": -6.1998399
      },
      {
        "lng": 106.6976988,
        "lat": -6.1997732
      },
      {
        "lng": 106.6972106,
        "lat": -6.1996559
      },
      {
        "lng": 106.6968303,
        "lat": -6.1995789
      },
      {
        "lng": 106.6964856,
        "lat": -6.1995029
      },
      {
        "lng": 106.6960725,
        "lat": -6.1994021
      },
      {
        "lng": 106.6959653,
        "lat": -6.1994029
      },
      {
        "lng": 106.6958454,
        "lat": -6.1993812
      },
      {
        "lng": 106.6957408,
        "lat": -6.1993412
      },
      {
        "lng": 106.6956281,
        "lat": -6.1992719
      },
      {
        "lng": 106.6955289,
        "lat": -6.1992159
      },
      {
        "lng": 106.6954162,
        "lat": -6.1990479
      },
      {
        "lng": 106.6953277,
        "lat": -6.1988533
      },
      {
        "lng": 106.6951748,
        "lat": -6.1987946
      },
      {
        "lng": 106.6947993,
        "lat": -6.1987466
      },
      {
        "lng": 106.6946196,
        "lat": -6.1987013
      },
      {
        "lng": 106.6944024,
        "lat": -6.1986719
      },
      {
        "lng": 106.6943353,
        "lat": -6.1986506
      },
      {
        "lng": 106.6940912,
        "lat": -6.1986879
      },
      {
        "lng": 106.693986,
        "lat": -6.1987366
      },
      {
        "lng": 106.693874,
        "lat": -6.1987786
      },
      {
        "lng": 106.6935977,
        "lat": -6.1989973
      },
      {
        "lng": 106.6932965,
        "lat": -6.1993015
      },
      {
        "lng": 106.6929084,
        "lat": -6.1996186
      },
      {
        "lng": 106.6928494,
        "lat": -6.1996426
      },
      {
        "lng": 106.6921788,
        "lat": -6.1997919
      },
      {
        "lng": 106.6918545,
        "lat": -6.1998767
      },
      {
        "lng": 106.6916415,
        "lat": -6.1999335
      },
      {
        "lng": 106.6914224,
        "lat": -6.1999972
      },
      {
        "lng": 106.6911569,
        "lat": -6.2001385
      },
      {
        "lng": 106.6909933,
        "lat": -6.2002505
      },
      {
        "lng": 106.690548,
        "lat": -6.2004878
      },
      {
        "lng": 106.69032,
        "lat": -6.2005465
      },
      {
        "lng": 106.6900349,
        "lat": -6.2004681
      },
      {
        "lng": 106.6897499,
        "lat": -6.200385
      },
      {
        "lng": 106.6897005,
        "lat": -6.2003705
      },
      {
        "lng": 106.6896575,
        "lat": -6.2003385
      },
      {
        "lng": 106.6896227,
        "lat": -6.2003492
      },
      {
        "lng": 106.6896031,
        "lat": -6.2004121
      },
      {
        "lng": 106.6895829,
        "lat": -6.2005121
      },
      {
        "lng": 106.6895011,
        "lat": -6.2007548
      },
      {
        "lng": 106.6894086,
        "lat": -6.2009468
      },
      {
        "lng": 106.6890693,
        "lat": -6.2014828
      },
      {
        "lng": 106.6890304,
        "lat": -6.2015814
      },
      {
        "lng": 106.6886187,
        "lat": -6.2023737
      },
      {
        "lng": 106.6885712,
        "lat": -6.2025384
      },
      {
        "lng": 106.6882521,
        "lat": -6.2032797
      },
      {
        "lng": 106.6881667,
        "lat": -6.2035413
      },
      {
        "lng": 106.6881061,
        "lat": -6.2038472
      },
      {
        "lng": 106.6880938,
        "lat": -6.2039063
      },
      {
        "lng": 106.6880858,
        "lat": -6.204077
      },
      {
        "lng": 106.68816,
        "lat": -6.2044079
      },
      {
        "lng": 106.6881475,
        "lat": -6.2045943
      },
      {
        "lng": 106.6881072,
        "lat": -6.2047143
      },
      {
        "lng": 106.6880715,
        "lat": -6.2049825
      },
      {
        "lng": 106.6880179,
        "lat": -6.2051919
      },
      {
        "lng": 106.687979,
        "lat": -6.2054318
      },
      {
        "lng": 106.6879302,
        "lat": -6.2058822
      },
      {
        "lng": 106.6879897,
        "lat": -6.2062918
      },
      {
        "lng": 106.6880997,
        "lat": -6.206788
      },
      {
        "lng": 106.688126,
        "lat": -6.2070341
      },
      {
        "lng": 106.6881761,
        "lat": -6.2072771
      },
      {
        "lng": 106.6881641,
        "lat": -6.2075837
      },
      {
        "lng": 106.6881394,
        "lat": -6.207898
      },
      {
        "lng": 106.6881573,
        "lat": -6.208545
      },
      {
        "lng": 106.6881692,
        "lat": -6.2090413
      },
      {
        "lng": 106.6882091,
        "lat": -6.2095913
      },
      {
        "lng": 106.6883505,
        "lat": -6.2104128
      },
      {
        "lng": 106.6884103,
        "lat": -6.2107272
      },
      {
        "lng": 106.6883781,
        "lat": -6.2107805
      },
      {
        "lng": 106.6881877,
        "lat": -6.2107912
      },
      {
        "lng": 106.6880241,
        "lat": -6.2107805
      },
      {
        "lng": 106.6877719,
        "lat": -6.2108018
      },
      {
        "lng": 106.6876155,
        "lat": -6.2107863
      },
      {
        "lng": 106.687493,
        "lat": -6.2108205
      },
      {
        "lng": 106.6865891,
        "lat": -6.2109112
      },
      {
        "lng": 106.6858113,
        "lat": -6.2109805
      },
      {
        "lng": 106.6852964,
        "lat": -6.2110477
      },
      {
        "lng": 106.6848591,
        "lat": -6.2110978
      },
      {
        "lng": 106.6846182,
        "lat": -6.2111794
      },
      {
        "lng": 106.6838497,
        "lat": -6.2114048
      },
      {
        "lng": 106.6835439,
        "lat": -6.2115074
      },
      {
        "lng": 106.6833531,
        "lat": -6.2115414
      },
      {
        "lng": 106.6828318,
        "lat": -6.2117114
      },
      {
        "lng": 106.6821921,
        "lat": -6.2118714
      },
      {
        "lng": 106.6815263,
        "lat": -6.2120289
      },
      {
        "lng": 106.6808389,
        "lat": -6.21219
      },
      {
        "lng": 106.6801813,
        "lat": -6.2123511
      },
      {
        "lng": 106.6801375,
        "lat": -6.2122527
      },
      {
        "lng": 106.6801142,
        "lat": -6.2121271
      },
      {
        "lng": 106.680066,
        "lat": -6.2120124
      },
      {
        "lng": 106.680015,
        "lat": -6.2119511
      },
      {
        "lng": 106.6799345,
        "lat": -6.2118898
      },
      {
        "lng": 106.6798648,
        "lat": -6.2118791
      },
      {
        "lng": 106.6797656,
        "lat": -6.2118338
      },
      {
        "lng": 106.6797146,
        "lat": -6.2117324
      },
      {
        "lng": 106.6797057,
        "lat": -6.2116247
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.707296,
        "lat": -6.197452
      },
      {
        "lng": 106.7074162,
        "lat": -6.1972463
      },
      {
        "lng": 106.7076388,
        "lat": -6.1969449
      },
      {
        "lng": 106.7077725,
        "lat": -6.1966882
      },
      {
        "lng": 106.7080566,
        "lat": -6.1963284
      },
      {
        "lng": 106.7080886,
        "lat": -6.1963072
      },
      {
        "lng": 106.7081961,
        "lat": -6.1961444
      },
      {
        "lng": 106.708351,
        "lat": -6.1960263
      },
      {
        "lng": 106.7085964,
        "lat": -6.1957837
      },
      {
        "lng": 106.7088151,
        "lat": -6.1956296
      },
      {
        "lng": 106.7088969,
        "lat": -6.1955403
      },
      {
        "lng": 106.7092039,
        "lat": -6.1948904
      },
      {
        "lng": 106.7093986,
        "lat": -6.1944244
      },
      {
        "lng": 106.7097189,
        "lat": -6.1938051
      },
      {
        "lng": 106.7101495,
        "lat": -6.1930191
      },
      {
        "lng": 106.7102473,
        "lat": -6.1927745
      },
      {
        "lng": 106.7104303,
        "lat": -6.1924101
      },
      {
        "lng": 106.7108588,
        "lat": -6.1914945
      },
      {
        "lng": 106.7112007,
        "lat": -6.1907772
      },
      {
        "lng": 106.7113702,
        "lat": -6.1904461
      },
      {
        "lng": 106.7117305,
        "lat": -6.1896572
      },
      {
        "lng": 106.7118499,
        "lat": -6.1894133
      },
      {
        "lng": 106.7119564,
        "lat": -6.18918
      },
      {
        "lng": 106.7119751,
        "lat": -6.1891453
      },
      {
        "lng": 106.7120073,
        "lat": -6.189132
      },
      {
        "lng": 106.7120368,
        "lat": -6.189128
      },
      {
        "lng": 106.712073,
        "lat": -6.189136
      },
      {
        "lng": 106.7124311,
        "lat": -6.1892906
      },
      {
        "lng": 106.7129097,
        "lat": -6.1895268
      },
      {
        "lng": 106.7135361,
        "lat": -6.189827
      },
      {
        "lng": 106.714212,
        "lat": -6.1902643
      },
      {
        "lng": 106.7146051,
        "lat": -6.1903612
      },
      {
        "lng": 106.7148987,
        "lat": -6.190435
      },
      {
        "lng": 106.7152349,
        "lat": -6.1906039
      },
      {
        "lng": 106.7154673,
        "lat": -6.190723
      },
      {
        "lng": 106.7158964,
        "lat": -6.190883
      },
      {
        "lng": 106.7161754,
        "lat": -6.1909363
      },
      {
        "lng": 106.7164973,
        "lat": -6.1909363
      },
      {
        "lng": 106.7166462,
        "lat": -6.1906607
      },
      {
        "lng": 106.7168339,
        "lat": -6.1899408
      },
      {
        "lng": 106.7169312,
        "lat": -6.1898224
      },
      {
        "lng": 106.7170841,
        "lat": -6.1894165
      },
      {
        "lng": 106.7171504,
        "lat": -6.1892581
      },
      {
        "lng": 106.7174616,
        "lat": -6.1886288
      },
      {
        "lng": 106.7179658,
        "lat": -6.1881702
      },
      {
        "lng": 106.7182233,
        "lat": -6.1880528
      },
      {
        "lng": 106.7189593,
        "lat": -6.1878888
      },
      {
        "lng": 106.7194984,
        "lat": -6.1877288
      },
      {
        "lng": 106.7195411,
        "lat": -6.1877693
      }
    ]
  },
  {
    "name": "SKTT METLAND - KEMBANGAN #1",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.706661,
        "lat": -6.197412
      },
      {
        "lng": 106.7063993,
        "lat": -6.197188
      },
      {
        "lng": 106.7062303,
        "lat": -6.1971693
      },
      {
        "lng": 106.7059453,
        "lat": -6.1971584
      },
      {
        "lng": 106.705549,
        "lat": -6.1971987
      },
      {
        "lng": 106.7051601,
        "lat": -6.1973453
      },
      {
        "lng": 106.7048094,
        "lat": -6.1975543
      },
      {
        "lng": 106.7045417,
        "lat": -6.197765
      },
      {
        "lng": 106.7043487,
        "lat": -6.1979053
      },
      {
        "lng": 106.7041092,
        "lat": -6.198071
      },
      {
        "lng": 106.7039644,
        "lat": -6.1981563
      },
      {
        "lng": 106.7039188,
        "lat": -6.1981483
      },
      {
        "lng": 106.7038812,
        "lat": -6.198119
      },
      {
        "lng": 106.703723,
        "lat": -6.1980843
      },
      {
        "lng": 106.7035662,
        "lat": -6.197833
      },
      {
        "lng": 106.7028578,
        "lat": -6.1969122
      },
      {
        "lng": 106.7022795,
        "lat": -6.1961772
      },
      {
        "lng": 106.7021749,
        "lat": -6.1959639
      },
      {
        "lng": 106.7020622,
        "lat": -6.1957745
      },
      {
        "lng": 106.7018476,
        "lat": -6.1953266
      },
      {
        "lng": 106.7017599,
        "lat": -6.1950706
      },
      {
        "lng": 106.7016813,
        "lat": -6.1948839
      },
      {
        "lng": 106.7016599,
        "lat": -6.1948092
      },
      {
        "lng": 106.7016411,
        "lat": -6.1947719
      },
      {
        "lng": 106.7015902,
        "lat": -6.1947506
      },
      {
        "lng": 106.7015258,
        "lat": -6.1947506
      },
      {
        "lng": 106.7014164,
        "lat": -6.1947758
      },
      {
        "lng": 106.7013756,
        "lat": -6.1948012
      },
      {
        "lng": 106.7013032,
        "lat": -6.1948172
      },
      {
        "lng": 106.7011884,
        "lat": -6.1948478
      },
      {
        "lng": 106.7010215,
        "lat": -6.1948972
      },
      {
        "lng": 106.7007479,
        "lat": -6.1950039
      },
      {
        "lng": 106.7004052,
        "lat": -6.1951051
      },
      {
        "lng": 106.700131,
        "lat": -6.1952012
      },
      {
        "lng": 106.6999278,
        "lat": -6.1952971
      },
      {
        "lng": 106.6998216,
        "lat": -6.1955248
      },
      {
        "lng": 106.6996053,
        "lat": -6.1960119
      },
      {
        "lng": 106.6994283,
        "lat": -6.1963158
      },
      {
        "lng": 106.6993586,
        "lat": -6.1965025
      },
      {
        "lng": 106.6993264,
        "lat": -6.1966732
      },
      {
        "lng": 106.699321,
        "lat": -6.1968918
      },
      {
        "lng": 106.6992827,
        "lat": -6.1971477
      },
      {
        "lng": 106.6992734,
        "lat": -6.1973121
      },
      {
        "lng": 106.6992298,
        "lat": -6.1974491
      },
      {
        "lng": 106.6990431,
        "lat": -6.1982642
      },
      {
        "lng": 106.6989519,
        "lat": -6.1984562
      },
      {
        "lng": 106.6988392,
        "lat": -6.1987602
      },
      {
        "lng": 106.6984315,
        "lat": -6.1996081
      },
      {
        "lng": 106.6983683,
        "lat": -6.1997032
      },
      {
        "lng": 106.6982813,
        "lat": -6.1998214
      },
      {
        "lng": 106.698174,
        "lat": -6.1998534
      },
      {
        "lng": 106.6979219,
        "lat": -6.1998001
      },
      {
        "lng": 106.6976966,
        "lat": -6.1997148
      },
      {
        "lng": 106.6969345,
        "lat": -6.1995396
      },
      {
        "lng": 106.6963294,
        "lat": -6.1994149
      },
      {
        "lng": 106.696056,
        "lat": -6.1993569
      },
      {
        "lng": 106.6958687,
        "lat": -6.1993068
      },
      {
        "lng": 106.6956081,
        "lat": -6.1991878
      },
      {
        "lng": 106.6954901,
        "lat": -6.1990224
      },
      {
        "lng": 106.6953667,
        "lat": -6.1987878
      },
      {
        "lng": 106.6952111,
        "lat": -6.1987238
      },
      {
        "lng": 106.6948195,
        "lat": -6.1986704
      },
      {
        "lng": 106.6945728,
        "lat": -6.1986171
      },
      {
        "lng": 106.6943153,
        "lat": -6.1985798
      },
      {
        "lng": 106.6940846,
        "lat": -6.1986224
      },
      {
        "lng": 106.6940263,
        "lat": -6.19865
      },
      {
        "lng": 106.6938861,
        "lat": -6.1986971
      },
      {
        "lng": 106.6936877,
        "lat": -6.1988038
      },
      {
        "lng": 106.6932344,
        "lat": -6.1992516
      },
      {
        "lng": 106.6928615,
        "lat": -6.1995491
      },
      {
        "lng": 106.692161,
        "lat": -6.1997238
      },
      {
        "lng": 106.6918628,
        "lat": -6.1997802
      },
      {
        "lng": 106.6915946,
        "lat": -6.1998602
      },
      {
        "lng": 106.6913585,
        "lat": -6.1999669
      },
      {
        "lng": 106.6905217,
        "lat": -6.2004415
      },
      {
        "lng": 106.6903179,
        "lat": -6.2005002
      },
      {
        "lng": 106.6897439,
        "lat": -6.2003402
      },
      {
        "lng": 106.6896419,
        "lat": -6.2003029
      },
      {
        "lng": 106.6895829,
        "lat": -6.2003082
      },
      {
        "lng": 106.6895454,
        "lat": -6.2003775
      },
      {
        "lng": 106.6895454,
        "lat": -6.2004522
      },
      {
        "lng": 106.689422,
        "lat": -6.2007882
      },
      {
        "lng": 106.6890089,
        "lat": -6.2014815
      },
      {
        "lng": 106.6887139,
        "lat": -6.2020681
      },
      {
        "lng": 106.6887083,
        "lat": -6.2021383
      },
      {
        "lng": 106.6886504,
        "lat": -6.2021948
      },
      {
        "lng": 106.6886048,
        "lat": -6.2022775
      },
      {
        "lng": 106.6885377,
        "lat": -6.2024695
      },
      {
        "lng": 106.6884466,
        "lat": -6.2026794
      },
      {
        "lng": 106.6883071,
        "lat": -6.203022
      },
      {
        "lng": 106.6882051,
        "lat": -6.2032721
      },
      {
        "lng": 106.6881139,
        "lat": -6.2035174
      },
      {
        "lng": 106.6880844,
        "lat": -6.2036374
      },
      {
        "lng": 106.6880469,
        "lat": -6.2037308
      },
      {
        "lng": 106.688031,
        "lat": -6.2037872
      },
      {
        "lng": 106.6880094,
        "lat": -6.2039846
      },
      {
        "lng": 106.688012,
        "lat": -6.2040934
      },
      {
        "lng": 106.6880978,
        "lat": -6.204416
      },
      {
        "lng": 106.6880925,
        "lat": -6.204488
      },
      {
        "lng": 106.6880978,
        "lat": -6.2045894
      },
      {
        "lng": 106.6880603,
        "lat": -6.2046934
      },
      {
        "lng": 106.6880537,
        "lat": -6.2047899
      },
      {
        "lng": 106.6879812,
        "lat": -6.2051099
      },
      {
        "lng": 106.6878967,
        "lat": -6.2055306
      },
      {
        "lng": 106.6878726,
        "lat": -6.2057685
      },
      {
        "lng": 106.6879128,
        "lat": -6.2061466
      },
      {
        "lng": 106.6879047,
        "lat": -6.2062186
      },
      {
        "lng": 106.6879222,
        "lat": -6.2063405
      },
      {
        "lng": 106.6879731,
        "lat": -6.2067703
      },
      {
        "lng": 106.6880764,
        "lat": -6.2071812
      },
      {
        "lng": 106.6880926,
        "lat": -6.2073404
      },
      {
        "lng": 106.6880818,
        "lat": -6.2078391
      },
      {
        "lng": 106.6880951,
        "lat": -6.2087498
      },
      {
        "lng": 106.6881115,
        "lat": -6.2090333
      },
      {
        "lng": 106.6881354,
        "lat": -6.2093817
      },
      {
        "lng": 106.6881622,
        "lat": -6.2096724
      },
      {
        "lng": 106.6882414,
        "lat": -6.2101309
      },
      {
        "lng": 106.6882829,
        "lat": -6.210369
      },
      {
        "lng": 106.6882963,
        "lat": -6.2105236
      },
      {
        "lng": 106.6883419,
        "lat": -6.2107236
      },
      {
        "lng": 106.6883204,
        "lat": -6.2107503
      },
      {
        "lng": 106.6882534,
        "lat": -6.2107449
      },
      {
        "lng": 106.6878323,
        "lat": -6.2107675
      },
      {
        "lng": 106.6875104,
        "lat": -6.2107689
      },
      {
        "lng": 106.6872007,
        "lat": -6.2108082
      },
      {
        "lng": 106.6865141,
        "lat": -6.2108682
      },
      {
        "lng": 106.6852884,
        "lat": -6.2109917
      },
      {
        "lng": 106.6849275,
        "lat": -6.2110383
      },
      {
        "lng": 106.6848497,
        "lat": -6.2110542
      },
      {
        "lng": 106.6844929,
        "lat": -6.2111769
      },
      {
        "lng": 106.6835245,
        "lat": -6.2114594
      },
      {
        "lng": 106.6829426,
        "lat": -6.2116329
      },
      {
        "lng": 106.6820361,
        "lat": -6.2118574
      },
      {
        "lng": 106.6815236,
        "lat": -6.2119743
      },
      {
        "lng": 106.6805958,
        "lat": -6.2121827
      },
      {
        "lng": 106.6804079,
        "lat": -6.2122328
      },
      {
        "lng": 106.6802336,
        "lat": -6.2122862
      },
      {
        "lng": 106.680196,
        "lat": -6.2122782
      },
      {
        "lng": 106.6801907,
        "lat": -6.2122275
      },
      {
        "lng": 106.68017,
        "lat": -6.212146
      },
      {
        "lng": 106.6800982,
        "lat": -6.2119308
      },
      {
        "lng": 106.6800512,
        "lat": -6.2118089
      },
      {
        "lng": 106.6800297,
        "lat": -6.2116995
      },
      {
        "lng": 106.6801009,
        "lat": -6.2115868
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5296061,
        "lat": -6.1827093
      },
      {
        "lng": 106.5293314,
        "lat": -6.182709
      },
      {
        "lng": 106.527428,
        "lat": -6.1806661
      },
      {
        "lng": 106.5254862,
        "lat": -6.1778712
      },
      {
        "lng": 106.5248365,
        "lat": -6.1749223
      },
      {
        "lng": 106.5250503,
        "lat": -6.1721772
      },
      {
        "lng": 106.5249256,
        "lat": -6.1691585
      },
      {
        "lng": 106.5251585,
        "lat": -6.1671664
      },
      {
        "lng": 106.5255531,
        "lat": -6.1654044
      },
      {
        "lng": 106.5260188,
        "lat": -6.1628748
      },
      {
        "lng": 106.5283171,
        "lat": -6.1625786
      },
      {
        "lng": 106.53063,
        "lat": -6.16233
      },
      {
        "lng": 106.5331739,
        "lat": -6.1620296
      },
      {
        "lng": 106.53563,
        "lat": -6.1606
      },
      {
        "lng": 106.538725,
        "lat": -6.1605996
      },
      {
        "lng": 106.54158,
        "lat": -6.15947
      },
      {
        "lng": 106.5434445,
        "lat": -6.1575603
      },
      {
        "lng": 106.5453262,
        "lat": -6.1557158
      },
      {
        "lng": 106.5473053,
        "lat": -6.1538387
      },
      {
        "lng": 106.5493469,
        "lat": -6.1518245
      },
      {
        "lng": 106.5514843,
        "lat": -6.1497561
      },
      {
        "lng": 106.5528985,
        "lat": -6.1482932
      },
      {
        "lng": 106.55448,
        "lat": -6.1468
      },
      {
        "lng": 106.5568145,
        "lat": -6.1444603
      },
      {
        "lng": 106.5587612,
        "lat": -6.1425704
      },
      {
        "lng": 106.559692,
        "lat": -6.141745
      },
      {
        "lng": 106.5596017,
        "lat": -6.1422261
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.4638875,
        "lat": -6.0601896
      },
      {
        "lng": 106.4639559,
        "lat": -6.0604884
      },
      {
        "lng": 106.4648729,
        "lat": -6.0631266
      },
      {
        "lng": 106.4669515,
        "lat": -6.0634889
      },
      {
        "lng": 106.4686664,
        "lat": -6.0651494
      },
      {
        "lng": 106.4706282,
        "lat": -6.0671092
      },
      {
        "lng": 106.4724811,
        "lat": -6.0689498
      },
      {
        "lng": 106.47415,
        "lat": -6.07056
      },
      {
        "lng": 106.47572,
        "lat": -6.07235
      },
      {
        "lng": 106.47781,
        "lat": -6.0745
      },
      {
        "lng": 106.4799529,
        "lat": -6.0765171
      },
      {
        "lng": 106.48189,
        "lat": -6.0786
      },
      {
        "lng": 106.4843,
        "lat": -6.07976
      },
      {
        "lng": 106.4870122,
        "lat": -6.0811994
      },
      {
        "lng": 106.48989,
        "lat": -6.0826479
      },
      {
        "lng": 106.49194,
        "lat": -6.08359
      },
      {
        "lng": 106.4942599,
        "lat": -6.0848734
      },
      {
        "lng": 106.49672,
        "lat": -6.08614
      },
      {
        "lng": 106.49931,
        "lat": -6.08733
      },
      {
        "lng": 106.50149,
        "lat": -6.0884
      },
      {
        "lng": 106.50417,
        "lat": -6.08986
      },
      {
        "lng": 106.5065192,
        "lat": -6.0907544
      },
      {
        "lng": 106.50954,
        "lat": -6.09166
      },
      {
        "lng": 106.5120912,
        "lat": -6.0924985
      },
      {
        "lng": 106.5146495,
        "lat": -6.0933849
      },
      {
        "lng": 106.5169111,
        "lat": -6.0942237
      },
      {
        "lng": 106.51809,
        "lat": -6.09473
      },
      {
        "lng": 106.5209927,
        "lat": -6.0955505
      },
      {
        "lng": 106.5217593,
        "lat": -6.0984338
      },
      {
        "lng": 106.52249,
        "lat": -6.10153
      },
      {
        "lng": 106.5232181,
        "lat": -6.1041859
      },
      {
        "lng": 106.523919,
        "lat": -6.106925
      },
      {
        "lng": 106.52448,
        "lat": -6.10926
      },
      {
        "lng": 106.52531,
        "lat": -6.1122
      },
      {
        "lng": 106.5260451,
        "lat": -6.1153317
      },
      {
        "lng": 106.52675,
        "lat": -6.11797
      },
      {
        "lng": 106.5274612,
        "lat": -6.1207703
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5274612,
        "lat": -6.1207703
      },
      {
        "lng": 106.5281858,
        "lat": -6.1236219
      },
      {
        "lng": 106.5287256,
        "lat": -6.1259145
      },
      {
        "lng": 106.52965,
        "lat": -6.12698
      },
      {
        "lng": 106.52965,
        "lat": -6.12865
      },
      {
        "lng": 106.5313062,
        "lat": -6.1295673
      },
      {
        "lng": 106.5324524,
        "lat": -6.1291541
      },
      {
        "lng": 106.5343079,
        "lat": -6.1286835
      },
      {
        "lng": 106.5364576,
        "lat": -6.1280629
      },
      {
        "lng": 106.5397334,
        "lat": -6.1282476
      },
      {
        "lng": 106.5417827,
        "lat": -6.1292289
      },
      {
        "lng": 106.5439,
        "lat": -6.13027
      },
      {
        "lng": 106.54598,
        "lat": -6.13131
      },
      {
        "lng": 106.54761,
        "lat": -6.13397
      },
      {
        "lng": 106.54926,
        "lat": -6.13667
      },
      {
        "lng": 106.5505,
        "lat": -6.13876
      },
      {
        "lng": 106.5535,
        "lat": -6.1399
      },
      {
        "lng": 106.55619,
        "lat": -6.14097
      },
      {
        "lng": 106.5587102,
        "lat": -6.1418381
      },
      {
        "lng": 106.5591186,
        "lat": -6.1421878
      },
      {
        "lng": 106.5593878,
        "lat": -6.1426941
      },
      {
        "lng": 106.5607976,
        "lat": -6.1429054
      },
      {
        "lng": 106.5634786,
        "lat": -6.1433641
      },
      {
        "lng": 106.5667315,
        "lat": -6.1432309
      },
      {
        "lng": 106.56991,
        "lat": -6.14308
      },
      {
        "lng": 106.5735589,
        "lat": -6.1429634
      },
      {
        "lng": 106.5756805,
        "lat": -6.1449019
      },
      {
        "lng": 106.5769496,
        "lat": -6.1460834
      },
      {
        "lng": 106.5780298,
        "lat": -6.1476187
      },
      {
        "lng": 106.5799276,
        "lat": -6.1478081
      },
      {
        "lng": 106.58174,
        "lat": -6.14793
      },
      {
        "lng": 106.583498,
        "lat": -6.1480973
      },
      {
        "lng": 106.58511,
        "lat": -6.1482
      },
      {
        "lng": 106.58635,
        "lat": -6.14834
      },
      {
        "lng": 106.5880019,
        "lat": -6.1484475
      },
      {
        "lng": 106.5892556,
        "lat": -6.1485245
      },
      {
        "lng": 106.59053,
        "lat": -6.14867
      },
      {
        "lng": 106.5917069,
        "lat": -6.1483558
      },
      {
        "lng": 106.5928548,
        "lat": -6.1485258
      },
      {
        "lng": 106.5939142,
        "lat": -6.1485562
      },
      {
        "lng": 106.59475,
        "lat": -6.14858
      },
      {
        "lng": 106.5957002,
        "lat": -6.1486758
      },
      {
        "lng": 106.59672,
        "lat": -6.1488
      },
      {
        "lng": 106.5975931,
        "lat": -6.148887
      },
      {
        "lng": 106.5984106,
        "lat": -6.1489627
      },
      {
        "lng": 106.5994293,
        "lat": -6.1490656
      },
      {
        "lng": 106.60034,
        "lat": -6.14923
      },
      {
        "lng": 106.6012888,
        "lat": -6.1496922
      },
      {
        "lng": 106.6023194,
        "lat": -6.1506152
      },
      {
        "lng": 106.6028419,
        "lat": -6.1511063
      },
      {
        "lng": 106.6035666,
        "lat": -6.1518432
      },
      {
        "lng": 106.6042824,
        "lat": -6.1526239
      },
      {
        "lng": 106.60477,
        "lat": -6.15314
      },
      {
        "lng": 106.6053287,
        "lat": -6.153701
      },
      {
        "lng": 106.60583,
        "lat": -6.15421
      },
      {
        "lng": 106.60622,
        "lat": -6.15466
      },
      {
        "lng": 106.606115,
        "lat": -6.155624
      },
      {
        "lng": 106.6060002,
        "lat": -6.1559423
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.658597,
        "lat": -6.1512698
      },
      {
        "lng": 106.6587826,
        "lat": -6.1517572
      },
      {
        "lng": 106.6577778,
        "lat": -6.1531944
      },
      {
        "lng": 106.6563056,
        "lat": -6.1539167
      },
      {
        "lng": 106.6545556,
        "lat": -6.1541389
      },
      {
        "lng": 106.6529444,
        "lat": -6.1543333
      },
      {
        "lng": 106.6512222,
        "lat": -6.1545
      },
      {
        "lng": 106.6495278,
        "lat": -6.1546944
      },
      {
        "lng": 106.648,
        "lat": -6.15475
      },
      {
        "lng": 106.6462778,
        "lat": -6.15475
      },
      {
        "lng": 106.6445833,
        "lat": -6.1547222
      },
      {
        "lng": 106.6429167,
        "lat": -6.1547222
      },
      {
        "lng": 106.6411944,
        "lat": -6.1546944
      },
      {
        "lng": 106.6394123,
        "lat": -6.1552019
      },
      {
        "lng": 106.6380149,
        "lat": -6.1559297
      },
      {
        "lng": 106.6366667,
        "lat": -6.1566389
      },
      {
        "lng": 106.6354444,
        "lat": -6.1575556
      },
      {
        "lng": 106.6338179,
        "lat": -6.158287
      },
      {
        "lng": 106.6321797,
        "lat": -6.1594869
      },
      {
        "lng": 106.6294444,
        "lat": -6.1606111
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6294444,
        "lat": -6.1606111
      },
      {
        "lng": 106.6278056,
        "lat": -6.161
      },
      {
        "lng": 106.6261629,
        "lat": -6.1611684
      },
      {
        "lng": 106.6243333,
        "lat": -6.1607778
      },
      {
        "lng": 106.6226389,
        "lat": -6.1605278
      },
      {
        "lng": 106.6208889,
        "lat": -6.1604722
      },
      {
        "lng": 106.6191389,
        "lat": -6.1606389
      },
      {
        "lng": 106.6173889,
        "lat": -6.1608056
      },
      {
        "lng": 106.6156944,
        "lat": -6.1609722
      },
      {
        "lng": 106.6139722,
        "lat": -6.1605
      },
      {
        "lng": 106.6128889,
        "lat": -6.1593056
      },
      {
        "lng": 106.6115278,
        "lat": -6.1586389
      },
      {
        "lng": 106.61025,
        "lat": -6.1579444
      },
      {
        "lng": 106.6091667,
        "lat": -6.1569444
      },
      {
        "lng": 106.6080556,
        "lat": -6.1557778
      },
      {
        "lng": 106.6067778,
        "lat": -6.1558333
      },
      {
        "lng": 106.6066493,
        "lat": -6.1561804
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6411949,
        "lat": -6.2066714
      },
      {
        "lng": 106.64161,
        "lat": -6.20677
      },
      {
        "lng": 106.6425634,
        "lat": -6.2071534
      },
      {
        "lng": 106.6453056,
        "lat": -6.2075278
      },
      {
        "lng": 106.6491667,
        "lat": -6.2078611
      },
      {
        "lng": 106.6519167,
        "lat": -6.2058889
      },
      {
        "lng": 106.6546111,
        "lat": -6.2039444
      },
      {
        "lng": 106.6570833,
        "lat": -6.2021944
      },
      {
        "lng": 106.6593611,
        "lat": -6.2005
      },
      {
        "lng": 106.6617222,
        "lat": -6.1991111
      },
      {
        "lng": 106.6651667,
        "lat": -6.1969444
      },
      {
        "lng": 106.6671667,
        "lat": -6.1958333
      },
      {
        "lng": 106.6688341,
        "lat": -6.1948517
      },
      {
        "lng": 106.6723611,
        "lat": -6.19275
      },
      {
        "lng": 106.6755556,
        "lat": -6.19075
      },
      {
        "lng": 106.6751815,
        "lat": -6.1889358
      },
      {
        "lng": 106.6743573,
        "lat": -6.1873061
      },
      {
        "lng": 106.6739233,
        "lat": -6.1864591
      },
      {
        "lng": 106.6736636,
        "lat": -6.1860565
      },
      {
        "lng": 106.6734764,
        "lat": -6.1857206
      },
      {
        "lng": 106.672609,
        "lat": -6.1841195
      },
      {
        "lng": 106.6717831,
        "lat": -6.1824998
      },
      {
        "lng": 106.6709751,
        "lat": -6.1809307
      },
      {
        "lng": 106.6701084,
        "lat": -6.1793562
      },
      {
        "lng": 106.669277,
        "lat": -6.1776824
      },
      {
        "lng": 106.6683351,
        "lat": -6.1761352
      },
      {
        "lng": 106.6676107,
        "lat": -6.1746429
      },
      {
        "lng": 106.666731,
        "lat": -6.1730963
      },
      {
        "lng": 106.6661572,
        "lat": -6.1721427
      },
      {
        "lng": 106.6659988,
        "lat": -6.171775
      },
      {
        "lng": 106.6657252,
        "lat": -6.1713243
      },
      {
        "lng": 106.6651137,
        "lat": -6.1699829
      },
      {
        "lng": 106.6643329,
        "lat": -6.1685596
      },
      {
        "lng": 106.6628843,
        "lat": -6.1658149
      },
      {
        "lng": 106.6622072,
        "lat": -6.1642996
      },
      {
        "lng": 106.6610423,
        "lat": -6.1626796
      },
      {
        "lng": 106.6598202,
        "lat": -6.160878
      },
      {
        "lng": 106.6596561,
        "lat": -6.1587889
      },
      {
        "lng": 106.6595128,
        "lat": -6.156637
      },
      {
        "lng": 106.6593608,
        "lat": -6.1541998
      },
      {
        "lng": 106.6592246,
        "lat": -6.1527004
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6590514,
        "lat": -6.1512058
      },
      {
        "lng": 106.6592168,
        "lat": -6.1517137
      },
      {
        "lng": 106.6592246,
        "lat": -6.1527004
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.6597452,
        "lat": -6.1509669
      },
      {
        "lng": 106.6597423,
        "lat": -6.1515201
      },
      {
        "lng": 106.6593024,
        "lat": -6.1527044
      },
      {
        "lng": 106.6594386,
        "lat": -6.1542038
      },
      {
        "lng": 106.6595906,
        "lat": -6.156641
      },
      {
        "lng": 106.6597339,
        "lat": -6.1587929
      },
      {
        "lng": 106.659898,
        "lat": -6.160882
      },
      {
        "lng": 106.6611201,
        "lat": -6.1626836
      },
      {
        "lng": 106.662285,
        "lat": -6.1643036
      },
      {
        "lng": 106.6629621,
        "lat": -6.1658189
      },
      {
        "lng": 106.6644107,
        "lat": -6.1685636
      },
      {
        "lng": 106.6651786,
        "lat": -6.1700936
      },
      {
        "lng": 106.6657172,
        "lat": -6.1713016
      },
      {
        "lng": 106.6661572,
        "lat": -6.1721427
      },
      {
        "lng": 106.666731,
        "lat": -6.1730963
      },
      {
        "lng": 106.6676134,
        "lat": -6.1746349
      },
      {
        "lng": 106.6683056,
        "lat": -6.1760979
      },
      {
        "lng": 106.669277,
        "lat": -6.1776824
      },
      {
        "lng": 106.6701084,
        "lat": -6.1793535
      },
      {
        "lng": 106.6709751,
        "lat": -6.1809307
      },
      {
        "lng": 106.6717818,
        "lat": -6.1824998
      },
      {
        "lng": 106.672609,
        "lat": -6.1841195
      },
      {
        "lng": 106.6734764,
        "lat": -6.1857206
      },
      {
        "lng": 106.6743573,
        "lat": -6.1873061
      },
      {
        "lng": 106.6751815,
        "lat": -6.1889358
      },
      {
        "lng": 106.6767991,
        "lat": -6.1900323
      },
      {
        "lng": 106.6796097,
        "lat": -6.1883912
      },
      {
        "lng": 106.6813721,
        "lat": -6.1873777
      },
      {
        "lng": 106.6830735,
        "lat": -6.1863038
      },
      {
        "lng": 106.6845273,
        "lat": -6.1855225
      },
      {
        "lng": 106.6865807,
        "lat": -6.1841946
      },
      {
        "lng": 106.6890004,
        "lat": -6.1827957
      },
      {
        "lng": 106.6909409,
        "lat": -6.1816121
      },
      {
        "lng": 106.6941162,
        "lat": -6.1797428
      },
      {
        "lng": 106.6974654,
        "lat": -6.1777526
      },
      {
        "lng": 106.6991757,
        "lat": -6.1766705
      },
      {
        "lng": 106.7009389,
        "lat": -6.1757818
      },
      {
        "lng": 106.7028678,
        "lat": -6.1745054
      },
      {
        "lng": 106.7046393,
        "lat": -6.1734276
      },
      {
        "lng": 106.7064407,
        "lat": -6.1720622
      },
      {
        "lng": 106.7081664,
        "lat": -6.1713329
      },
      {
        "lng": 106.7099998,
        "lat": -6.1701277
      },
      {
        "lng": 106.7116835,
        "lat": -6.1691471
      },
      {
        "lng": 106.713335,
        "lat": -6.168217
      },
      {
        "lng": 106.7153659,
        "lat": -6.1671537
      },
      {
        "lng": 106.7186846,
        "lat": -6.1681039
      },
      {
        "lng": 106.7202546,
        "lat": -6.1685703
      },
      {
        "lng": 106.722355,
        "lat": -6.1692254
      },
      {
        "lng": 106.7253311,
        "lat": -6.1708948
      },
      {
        "lng": 106.7254659,
        "lat": -6.1702673
      },
      {
        "lng": 106.7258026,
        "lat": -6.1702206
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7310592,
        "lat": -6.1922835
      },
      {
        "lng": 106.7317598,
        "lat": -6.1933874
      },
      {
        "lng": 106.7329722,
        "lat": -6.1956389
      },
      {
        "lng": 106.7342222,
        "lat": -6.1983889
      },
      {
        "lng": 106.7354444,
        "lat": -6.2007778
      },
      {
        "lng": 106.7369444,
        "lat": -6.2034444
      },
      {
        "lng": 106.7380833,
        "lat": -6.2060833
      },
      {
        "lng": 106.7392222,
        "lat": -6.2088889
      },
      {
        "lng": 106.7403333,
        "lat": -6.2116111
      },
      {
        "lng": 106.7414167,
        "lat": -6.2143333
      },
      {
        "lng": 106.7423333,
        "lat": -6.2167778
      },
      {
        "lng": 106.7433889,
        "lat": -6.2191667
      },
      {
        "lng": 106.7443333,
        "lat": -6.2215278
      },
      {
        "lng": 106.7441111,
        "lat": -6.2245278
      },
      {
        "lng": 106.7439167,
        "lat": -6.2274444
      },
      {
        "lng": 106.7435124,
        "lat": -6.2302416
      },
      {
        "lng": 106.7434722,
        "lat": -6.2329444
      },
      {
        "lng": 106.7432778,
        "lat": -6.2358611
      },
      {
        "lng": 106.7431111,
        "lat": -6.2383056
      },
      {
        "lng": 106.7428889,
        "lat": -6.2413056
      },
      {
        "lng": 106.7426944,
        "lat": -6.2438611
      },
      {
        "lng": 106.7424444,
        "lat": -6.2470556
      },
      {
        "lng": 106.7422778,
        "lat": -6.2496111
      },
      {
        "lng": 106.7419444,
        "lat": -6.2523611
      },
      {
        "lng": 106.7425833,
        "lat": -6.2525278
      },
      {
        "lng": 106.7431474,
        "lat": -6.2525701
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7258798,
        "lat": -6.169242
      },
      {
        "lng": 106.7261944,
        "lat": -6.1691667
      },
      {
        "lng": 106.7269444,
        "lat": -6.1689167
      },
      {
        "lng": 106.7272778,
        "lat": -6.1679444
      },
      {
        "lng": 106.7270278,
        "lat": -6.1662778
      },
      {
        "lng": 106.726943,
        "lat": -6.1643663
      },
      {
        "lng": 106.7269166,
        "lat": -6.162546
      },
      {
        "lng": 106.7268889,
        "lat": -6.1608333
      },
      {
        "lng": 106.7269444,
        "lat": -6.1595
      },
      {
        "lng": 106.7268611,
        "lat": -6.1580833
      },
      {
        "lng": 106.7278056,
        "lat": -6.157
      },
      {
        "lng": 106.7279722,
        "lat": -6.1553056
      },
      {
        "lng": 106.7288889,
        "lat": -6.1546944
      },
      {
        "lng": 106.7303333,
        "lat": -6.1551111
      },
      {
        "lng": 106.7321267,
        "lat": -6.1551618
      },
      {
        "lng": 106.73375,
        "lat": -6.1548889
      },
      {
        "lng": 106.7354722,
        "lat": -6.1548333
      },
      {
        "lng": 106.7371667,
        "lat": -6.1548333
      },
      {
        "lng": 106.7387222,
        "lat": -6.1548333
      },
      {
        "lng": 106.74025,
        "lat": -6.1548889
      },
      {
        "lng": 106.7420278,
        "lat": -6.1549722
      },
      {
        "lng": 106.74367,
        "lat": -6.15507
      },
      {
        "lng": 106.7454508,
        "lat": -6.1553085
      },
      {
        "lng": 106.7471944,
        "lat": -6.1555
      },
      {
        "lng": 106.7488333,
        "lat": -6.1556667
      },
      {
        "lng": 106.7506111,
        "lat": -6.1558333
      },
      {
        "lng": 106.7521944,
        "lat": -6.1560833
      },
      {
        "lng": 106.754,
        "lat": -6.1562778
      },
      {
        "lng": 106.7555278,
        "lat": -6.1567222
      },
      {
        "lng": 106.7572778,
        "lat": -6.1571667
      },
      {
        "lng": 106.7588889,
        "lat": -6.1576944
      },
      {
        "lng": 106.7606111,
        "lat": -6.15825
      },
      {
        "lng": 106.7621111,
        "lat": -6.1586667
      },
      {
        "lng": 106.7634722,
        "lat": -6.1586389
      },
      {
        "lng": 106.7647222,
        "lat": -6.1591944
      },
      {
        "lng": 106.7665278,
        "lat": -6.1602222
      },
      {
        "lng": 106.7668889,
        "lat": -6.1621389
      },
      {
        "lng": 106.7671516,
        "lat": -6.1633085
      },
      {
        "lng": 106.767004,
        "lat": -6.1635871
      }
    ]
  },
  {
    "name": "PANTAI INDAH KAPUK - DURIKOSAMBI",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7259063,
        "lat": -6.1698017
      },
      {
        "lng": 106.7263611,
        "lat": -6.16975
      },
      {
        "lng": 106.7287778,
        "lat": -6.1696944
      },
      {
        "lng": 106.7298611,
        "lat": -6.1679167
      },
      {
        "lng": 106.7311111,
        "lat": -6.1653056
      },
      {
        "lng": 106.7321667,
        "lat": -6.1628333
      },
      {
        "lng": 106.7334167,
        "lat": -6.1603611
      },
      {
        "lng": 106.7347222,
        "lat": -6.1575833
      },
      {
        "lng": 106.7358889,
        "lat": -6.1553333
      },
      {
        "lng": 106.7365278,
        "lat": -6.1542778
      },
      {
        "lng": 106.7374444,
        "lat": -6.1523889
      },
      {
        "lng": 106.738535,
        "lat": -6.151023
      },
      {
        "lng": 106.73927,
        "lat": -6.150063
      },
      {
        "lng": 106.7393333,
        "lat": -6.1499444
      },
      {
        "lng": 106.7410556,
        "lat": -6.1478333
      },
      {
        "lng": 106.7428056,
        "lat": -6.1456389
      },
      {
        "lng": 106.7446111,
        "lat": -6.1433333
      },
      {
        "lng": 106.7465278,
        "lat": -6.1409444
      },
      {
        "lng": 106.7483056,
        "lat": -6.13875
      },
      {
        "lng": 106.7501667,
        "lat": -6.1363889
      },
      {
        "lng": 106.7519167,
        "lat": -6.1341389
      },
      {
        "lng": 106.7524197,
        "lat": -6.1314073
      },
      {
        "lng": 106.7521667,
        "lat": -6.1285833
      },
      {
        "lng": 106.7519375,
        "lat": -6.1257612
      },
      {
        "lng": 106.7514924,
        "lat": -6.1240623
      },
      {
        "lng": 106.7512159,
        "lat": -6.123989
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7808934,
        "lat": -6.1094699
      },
      {
        "lng": 106.7805781,
        "lat": -6.1100657
      },
      {
        "lng": 106.7804472,
        "lat": -6.1103095
      },
      {
        "lng": 106.7796425,
        "lat": -6.1099734
      },
      {
        "lng": 106.7788462,
        "lat": -6.1096418
      },
      {
        "lng": 106.7781622,
        "lat": -6.1093839
      },
      {
        "lng": 106.7768485,
        "lat": -6.1089873
      },
      {
        "lng": 106.7740833,
        "lat": -6.1079167
      },
      {
        "lng": 106.7713889,
        "lat": -6.1069167
      },
      {
        "lng": 106.7686944,
        "lat": -6.1059167
      },
      {
        "lng": 106.7657611,
        "lat": -6.1059594
      },
      {
        "lng": 106.7631944,
        "lat": -6.1073611
      },
      {
        "lng": 106.7608611,
        "lat": -6.1087222
      },
      {
        "lng": 106.7584444,
        "lat": -6.1100556
      },
      {
        "lng": 106.7560278,
        "lat": -6.1113889
      },
      {
        "lng": 106.7535,
        "lat": -6.11275
      },
      {
        "lng": 106.7508889,
        "lat": -6.1142778
      },
      {
        "lng": 106.7511389,
        "lat": -6.1171944
      },
      {
        "lng": 106.7513889,
        "lat": -6.1200833
      },
      {
        "lng": 106.7516944,
        "lat": -6.1229444
      },
      {
        "lng": 106.7514769,
        "lat": -6.1237681
      },
      {
        "lng": 106.7512284,
        "lat": -6.1238231
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.787529,
        "lat": -6.1117992
      },
      {
        "lng": 106.7875132,
        "lat": -6.1121036
      },
      {
        "lng": 106.7873705,
        "lat": -6.1120911
      },
      {
        "lng": 106.7870806,
        "lat": -6.1121245
      },
      {
        "lng": 106.7866134,
        "lat": -6.1121288
      },
      {
        "lng": 106.7859343,
        "lat": -6.1121416
      },
      {
        "lng": 106.7853068,
        "lat": -6.1121496
      },
      {
        "lng": 106.7846111,
        "lat": -6.1122222
      },
      {
        "lng": 106.7841944,
        "lat": -6.1147222
      },
      {
        "lng": 106.7838611,
        "lat": -6.1172222
      },
      {
        "lng": 106.7835,
        "lat": -6.1201389
      },
      {
        "lng": 106.7835306,
        "lat": -6.1229427
      },
      {
        "lng": 106.7835,
        "lat": -6.12575
      },
      {
        "lng": 106.7840278,
        "lat": -6.1283333
      },
      {
        "lng": 106.7848056,
        "lat": -6.1310556
      },
      {
        "lng": 106.7876095,
        "lat": -6.1316517
      },
      {
        "lng": 106.7898611,
        "lat": -6.1320278
      },
      {
        "lng": 106.7906667,
        "lat": -6.1327222
      },
      {
        "lng": 106.7908611,
        "lat": -6.13375
      },
      {
        "lng": 106.7910331,
        "lat": -6.1343589
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7670884,
        "lat": -6.1636615
      },
      {
        "lng": 106.7671516,
        "lat": -6.1633085
      },
      {
        "lng": 106.7680556,
        "lat": -6.1633889
      },
      {
        "lng": 106.7698056,
        "lat": -6.16375
      },
      {
        "lng": 106.7715,
        "lat": -6.1643056
      },
      {
        "lng": 106.7730833,
        "lat": -6.1651944
      },
      {
        "lng": 106.7749722,
        "lat": -6.1655833
      },
      {
        "lng": 106.7766111,
        "lat": -6.1664722
      },
      {
        "lng": 106.778368,
        "lat": -6.1665817
      },
      {
        "lng": 106.7799444,
        "lat": -6.166
      },
      {
        "lng": 106.7809456,
        "lat": -6.1659956
      },
      {
        "lng": 106.7822283,
        "lat": -6.1664193
      },
      {
        "lng": 106.7836389,
        "lat": -6.1667778
      },
      {
        "lng": 106.7837016,
        "lat": -6.1665084
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.4644702,
        "lat": -6.060323
      },
      {
        "lng": 106.4644627,
        "lat": -6.0605261
      },
      {
        "lng": 106.4674765,
        "lat": -6.0618292
      },
      {
        "lng": 106.4712132,
        "lat": -6.0635513
      },
      {
        "lng": 106.47033,
        "lat": -6.0660608
      },
      {
        "lng": 106.4702519,
        "lat": -6.0666057
      },
      {
        "lng": 106.4702293,
        "lat": -6.0668224
      },
      {
        "lng": 106.4701429,
        "lat": -6.0673211
      },
      {
        "lng": 106.472507,
        "lat": -6.0697648
      },
      {
        "lng": 106.4745975,
        "lat": -6.0718274
      },
      {
        "lng": 106.4769291,
        "lat": -6.0739966
      },
      {
        "lng": 106.4779258,
        "lat": -6.0749153
      },
      {
        "lng": 106.4800256,
        "lat": -6.0770362
      },
      {
        "lng": 106.4817932,
        "lat": -6.0789116
      },
      {
        "lng": 106.4843274,
        "lat": -6.0801846
      },
      {
        "lng": 106.4869036,
        "lat": -6.0814194
      },
      {
        "lng": 106.4891822,
        "lat": -6.0836835
      },
      {
        "lng": 106.4895175,
        "lat": -6.08682
      },
      {
        "lng": 106.4898225,
        "lat": -6.0899944
      },
      {
        "lng": 106.4912584,
        "lat": -6.092584
      },
      {
        "lng": 106.4931712,
        "lat": -6.094939
      },
      {
        "lng": 106.4932208,
        "lat": -6.0978246
      },
      {
        "lng": 106.4935047,
        "lat": -6.1007104
      },
      {
        "lng": 106.4935638,
        "lat": -6.1034982
      },
      {
        "lng": 106.4934611,
        "lat": -6.1063271
      },
      {
        "lng": 106.4939124,
        "lat": -6.1093347
      },
      {
        "lng": 106.4944883,
        "lat": -6.1123446
      },
      {
        "lng": 106.4948996,
        "lat": -6.1154144
      },
      {
        "lng": 106.4953234,
        "lat": -6.1184688
      },
      {
        "lng": 106.4950551,
        "lat": -6.121909
      },
      {
        "lng": 106.4940275,
        "lat": -6.1248036
      },
      {
        "lng": 106.4939203,
        "lat": -6.1271912
      },
      {
        "lng": 106.4942751,
        "lat": -6.1302682
      },
      {
        "lng": 106.4943484,
        "lat": -6.1334324
      },
      {
        "lng": 106.4937729,
        "lat": -6.1364967
      },
      {
        "lng": 106.4928551,
        "lat": -6.1395136
      },
      {
        "lng": 106.4896751,
        "lat": -6.1391557
      },
      {
        "lng": 106.4868901,
        "lat": -6.1398007
      },
      {
        "lng": 106.4860351,
        "lat": -6.1428224
      },
      {
        "lng": 106.4851933,
        "lat": -6.1463344
      },
      {
        "lng": 106.484009,
        "lat": -6.1476767
      },
      {
        "lng": 106.4835823,
        "lat": -6.1473793
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5832521,
        "lat": -6.2144121
      },
      {
        "lng": 106.5832147,
        "lat": -6.2146401
      },
      {
        "lng": 106.5807467,
        "lat": -6.2156788
      },
      {
        "lng": 106.5783263,
        "lat": -6.2164339
      },
      {
        "lng": 106.5764157,
        "lat": -6.2200887
      },
      {
        "lng": 106.5772603,
        "lat": -6.220927
      },
      {
        "lng": 106.5792829,
        "lat": -6.220857
      },
      {
        "lng": 106.5823494,
        "lat": -6.2209566
      },
      {
        "lng": 106.5853852,
        "lat": -6.2207952
      },
      {
        "lng": 106.5888111,
        "lat": -6.2207431
      },
      {
        "lng": 106.5922815,
        "lat": -6.2207077
      },
      {
        "lng": 106.5944524,
        "lat": -6.2204808
      },
      {
        "lng": 106.5942508,
        "lat": -6.2203172
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5942508,
        "lat": -6.2203172
      },
      {
        "lng": 106.5944524,
        "lat": -6.2204808
      },
      {
        "lng": 106.5977816,
        "lat": -6.220582
      },
      {
        "lng": 106.6013047,
        "lat": -6.220378
      },
      {
        "lng": 106.6046874,
        "lat": -6.2204277
      },
      {
        "lng": 106.606585,
        "lat": -6.2202635
      },
      {
        "lng": 106.608321,
        "lat": -6.2202278
      },
      {
        "lng": 106.6111148,
        "lat": -6.2203849
      },
      {
        "lng": 106.613834,
        "lat": -6.2202746
      },
      {
        "lng": 106.6176673,
        "lat": -6.2201255
      },
      {
        "lng": 106.6214054,
        "lat": -6.2200312
      },
      {
        "lng": 106.6250051,
        "lat": -6.219954
      },
      {
        "lng": 106.628795,
        "lat": -6.2200422
      },
      {
        "lng": 106.6319423,
        "lat": -6.2190271
      },
      {
        "lng": 106.6337639,
        "lat": -6.2181944
      },
      {
        "lng": 106.6371513,
        "lat": -6.2166006
      },
      {
        "lng": 106.6401061,
        "lat": -6.214484
      },
      {
        "lng": 106.6429168,
        "lat": -6.2123728
      },
      {
        "lng": 106.6437006,
        "lat": -6.2118225
      },
      {
        "lng": 106.6431657,
        "lat": -6.2099634
      },
      {
        "lng": 106.6424732,
        "lat": -6.207374
      },
      {
        "lng": 106.6418054,
        "lat": -6.2070557
      },
      {
        "lng": 106.6411905,
        "lat": -6.2069623
      }
    ]
  },
  {
    "name": "SUTT GAJAH TUNGGAL - PASAR KEMIS",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5489847,
        "lat": -6.1659711
      },
      {
        "lng": 106.5487746,
        "lat": -6.1659146
      },
      {
        "lng": 106.5462521,
        "lat": -6.1653431
      },
      {
        "lng": 106.5445141,
        "lat": -6.164272
      },
      {
        "lng": 106.5426224,
        "lat": -6.163111
      },
      {
        "lng": 106.5412329,
        "lat": -6.1606643
      },
      {
        "lng": 106.538725,
        "lat": -6.1605996
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.4641451,
        "lat": -6.0601328
      },
      {
        "lng": 106.4639559,
        "lat": -6.0604884
      },
      {
        "lng": 106.4648729,
        "lat": -6.0631266
      },
      {
        "lng": 106.4669515,
        "lat": -6.0634889
      },
      {
        "lng": 106.4686664,
        "lat": -6.0651494
      },
      {
        "lng": 106.4706683,
        "lat": -6.0671742
      },
      {
        "lng": 106.4724811,
        "lat": -6.0689498
      },
      {
        "lng": 106.4751275,
        "lat": -6.0677552
      },
      {
        "lng": 106.4773504,
        "lat": -6.0667876
      },
      {
        "lng": 106.4799218,
        "lat": -6.0655553
      },
      {
        "lng": 106.4828027,
        "lat": -6.0638047
      },
      {
        "lng": 106.4848119,
        "lat": -6.0633437
      },
      {
        "lng": 106.4872651,
        "lat": -6.0622347
      },
      {
        "lng": 106.4896403,
        "lat": -6.061136
      },
      {
        "lng": 106.4923501,
        "lat": -6.059904
      },
      {
        "lng": 106.4947389,
        "lat": -6.0588213
      },
      {
        "lng": 106.4972698,
        "lat": -6.0575932
      },
      {
        "lng": 106.4999552,
        "lat": -6.05649
      },
      {
        "lng": 106.5022731,
        "lat": -6.0554717
      },
      {
        "lng": 106.50497,
        "lat": -6.0541636
      },
      {
        "lng": 106.5073891,
        "lat": -6.0530309
      },
      {
        "lng": 106.5103296,
        "lat": -6.0516936
      },
      {
        "lng": 106.5130364,
        "lat": -6.0505093
      },
      {
        "lng": 106.5154035,
        "lat": -6.0493666
      },
      {
        "lng": 106.5175533,
        "lat": -6.0484395
      },
      {
        "lng": 106.5198385,
        "lat": -6.047458
      },
      {
        "lng": 106.5224307,
        "lat": -6.0462556
      },
      {
        "lng": 106.5247822,
        "lat": -6.0451979
      },
      {
        "lng": 106.5273702,
        "lat": -6.0440545
      },
      {
        "lng": 106.5299987,
        "lat": -6.0428596
      },
      {
        "lng": 106.5328125,
        "lat": -6.0431039
      },
      {
        "lng": 106.5355127,
        "lat": -6.0434258
      },
      {
        "lng": 106.5382814,
        "lat": -6.0437416
      },
      {
        "lng": 106.5409906,
        "lat": -6.0440473
      },
      {
        "lng": 106.5435436,
        "lat": -6.0443414
      },
      {
        "lng": 106.5462335,
        "lat": -6.0446338
      },
      {
        "lng": 106.5490317,
        "lat": -6.0449721
      },
      {
        "lng": 106.55176,
        "lat": -6.0452803
      },
      {
        "lng": 106.554361,
        "lat": -6.045517
      },
      {
        "lng": 106.556505,
        "lat": -6.045743
      },
      {
        "lng": 106.559017,
        "lat": -6.046175
      },
      {
        "lng": 106.5618914,
        "lat": -6.0464281
      },
      {
        "lng": 106.564496,
        "lat": -6.046739
      },
      {
        "lng": 106.566744,
        "lat": -6.0470264
      },
      {
        "lng": 106.5694941,
        "lat": -6.0473891
      },
      {
        "lng": 106.5719833,
        "lat": -6.0476473
      },
      {
        "lng": 106.574389,
        "lat": -6.048239
      },
      {
        "lng": 106.577228,
        "lat": -6.04883
      },
      {
        "lng": 106.5799167,
        "lat": -6.0486237
      },
      {
        "lng": 106.582712,
        "lat": -6.048934
      },
      {
        "lng": 106.5856892,
        "lat": -6.0493248
      },
      {
        "lng": 106.5886185,
        "lat": -6.0496614
      },
      {
        "lng": 106.5907067,
        "lat": -6.0499161
      },
      {
        "lng": 106.5936323,
        "lat": -6.0502003
      },
      {
        "lng": 106.5966296,
        "lat": -6.0502652
      },
      {
        "lng": 106.5991632,
        "lat": -6.0508302
      },
      {
        "lng": 106.602046,
        "lat": -6.051104
      },
      {
        "lng": 106.6043551,
        "lat": -6.0514397
      },
      {
        "lng": 106.6066604,
        "lat": -6.051697
      },
      {
        "lng": 106.6093024,
        "lat": -6.0519767
      },
      {
        "lng": 106.6119789,
        "lat": -6.0523266
      },
      {
        "lng": 106.6147794,
        "lat": -6.0526153
      },
      {
        "lng": 106.6174344,
        "lat": -6.0529352
      },
      {
        "lng": 106.6205503,
        "lat": -6.0532993
      },
      {
        "lng": 106.6231528,
        "lat": -6.0535567
      },
      {
        "lng": 106.6258344,
        "lat": -6.0538662
      },
      {
        "lng": 106.6281992,
        "lat": -6.0541732
      },
      {
        "lng": 106.6301477,
        "lat": -6.0546765
      },
      {
        "lng": 106.6320572,
        "lat": -6.0552098
      },
      {
        "lng": 106.6343023,
        "lat": -6.0553247
      },
      {
        "lng": 106.637002,
        "lat": -6.056237
      },
      {
        "lng": 106.6379331,
        "lat": -6.0574254
      },
      {
        "lng": 106.6402275,
        "lat": -6.0560227
      },
      {
        "lng": 106.6436453,
        "lat": -6.0551728
      },
      {
        "lng": 106.6462618,
        "lat": -6.0545461
      },
      {
        "lng": 106.6474074,
        "lat": -6.0519513
      },
      {
        "lng": 106.6502921,
        "lat": -6.050354
      },
      {
        "lng": 106.652343,
        "lat": -6.0516666
      },
      {
        "lng": 106.6552975,
        "lat": -6.0523156
      },
      {
        "lng": 106.6566057,
        "lat": -6.0539093
      },
      {
        "lng": 106.6599778,
        "lat": -6.0560708
      },
      {
        "lng": 106.6621125,
        "lat": -6.058584
      },
      {
        "lng": 106.6640307,
        "lat": -6.0606982
      },
      {
        "lng": 106.6664949,
        "lat": -6.0632898
      },
      {
        "lng": 106.6686017,
        "lat": -6.0628156
      },
      {
        "lng": 106.6710732,
        "lat": -6.0622371
      },
      {
        "lng": 106.6744221,
        "lat": -6.0612881
      },
      {
        "lng": 106.6771823,
        "lat": -6.0610485
      },
      {
        "lng": 106.6769268,
        "lat": -6.0604118
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.635792,
        "lat": -6.0642871
      },
      {
        "lng": 106.6358014,
        "lat": -6.0640284
      },
      {
        "lng": 106.6357239,
        "lat": -6.0633379
      },
      {
        "lng": 106.6369735,
        "lat": -6.0609779
      },
      {
        "lng": 106.6382349,
        "lat": -6.0586291
      },
      {
        "lng": 106.6379331,
        "lat": -6.0574254
      },
      {
        "lng": 106.6402275,
        "lat": -6.0560227
      },
      {
        "lng": 106.6436453,
        "lat": -6.0551728
      },
      {
        "lng": 106.6462618,
        "lat": -6.0545461
      },
      {
        "lng": 106.6474074,
        "lat": -6.0519513
      },
      {
        "lng": 106.6502921,
        "lat": -6.050354
      },
      {
        "lng": 106.652343,
        "lat": -6.0516666
      },
      {
        "lng": 106.6552975,
        "lat": -6.0523156
      },
      {
        "lng": 106.6566057,
        "lat": -6.0539093
      },
      {
        "lng": 106.6599778,
        "lat": -6.0560708
      },
      {
        "lng": 106.6621125,
        "lat": -6.058584
      },
      {
        "lng": 106.6640307,
        "lat": -6.0606982
      },
      {
        "lng": 106.6664949,
        "lat": -6.0632898
      },
      {
        "lng": 106.6686017,
        "lat": -6.0628156
      },
      {
        "lng": 106.6710732,
        "lat": -6.0622371
      },
      {
        "lng": 106.6744221,
        "lat": -6.0612881
      },
      {
        "lng": 106.6771823,
        "lat": -6.0610485
      },
      {
        "lng": 106.6771498,
        "lat": -6.0602847
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.5489847,
        "lat": -6.1659711
      },
      {
        "lng": 106.5487746,
        "lat": -6.1659146
      },
      {
        "lng": 106.5462521,
        "lat": -6.1653431
      },
      {
        "lng": 106.5445141,
        "lat": -6.164272
      },
      {
        "lng": 106.5426224,
        "lat": -6.163111
      },
      {
        "lng": 106.5412329,
        "lat": -6.1606643
      },
      {
        "lng": 106.54158,
        "lat": -6.15947
      }
    ]
  },
  {
    "name": "JAWA 7 - BALARAJA",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.422138,
        "lat": -6.199359
      },
      {
        "lng": 106.421552,
        "lat": -6.199431
      },
      {
        "lng": 106.420352,
        "lat": -6.197541
      },
      {
        "lng": 106.417682,
        "lat": -6.19428
      },
      {
        "lng": 106.41816,
        "lat": -6.19179
      },
      {
        "lng": 106.41662,
        "lat": -6.18911
      },
      {
        "lng": 106.41451,
        "lat": -6.18571
      },
      {
        "lng": 106.41254,
        "lat": -6.18257
      },
      {
        "lng": 106.41073,
        "lat": -6.17958
      },
      {
        "lng": 106.40869,
        "lat": -6.17601
      },
      {
        "lng": 106.406596,
        "lat": -6.17251
      },
      {
        "lng": 106.404811,
        "lat": -6.169578
      },
      {
        "lng": 106.404396,
        "lat": -6.168856
      },
      {
        "lng": 106.401076,
        "lat": -6.168576
      },
      {
        "lng": 106.39811,
        "lat": -6.1684
      },
      {
        "lng": 106.39433,
        "lat": -6.16815
      },
      {
        "lng": 106.388404,
        "lat": -6.167953
      },
      {
        "lng": 106.38409,
        "lat": -6.167722
      },
      {
        "lng": 106.38031,
        "lat": -6.16762
      },
      {
        "lng": 106.376107,
        "lat": -6.167402
      },
      {
        "lng": 106.372334,
        "lat": -6.167237
      },
      {
        "lng": 106.368284,
        "lat": -6.167081
      },
      {
        "lng": 106.36421,
        "lat": -6.166956
      },
      {
        "lng": 106.36067,
        "lat": -6.16683
      },
      {
        "lng": 106.35681,
        "lat": -6.16673
      },
      {
        "lng": 106.35294,
        "lat": -6.16652
      },
      {
        "lng": 106.349054,
        "lat": -6.166593
      },
      {
        "lng": 106.34646,
        "lat": -6.16335
      },
      {
        "lng": 106.345189,
        "lat": -6.161807
      },
      {
        "lng": 106.342743,
        "lat": -6.161667
      },
      {
        "lng": 106.342195,
        "lat": -6.15835
      },
      {
        "lng": 106.338723,
        "lat": -6.157934
      },
      {
        "lng": 106.336412,
        "lat": -6.155933
      },
      {
        "lng": 106.334696,
        "lat": -6.154443
      },
      {
        "lng": 106.332086,
        "lat": -6.15194
      },
      {
        "lng": 106.329903,
        "lat": -6.149772
      },
      {
        "lng": 106.329341,
        "lat": -6.145421
      },
      {
        "lng": 106.325067,
        "lat": -6.142988
      },
      {
        "lng": 106.322738,
        "lat": -6.143202
      },
      {
        "lng": 106.321337,
        "lat": -6.141776
      },
      {
        "lng": 106.318264,
        "lat": -6.13861
      },
      {
        "lng": 106.315712,
        "lat": -6.136075
      },
      {
        "lng": 106.313165,
        "lat": -6.13348
      },
      {
        "lng": 106.311614,
        "lat": -6.130306
      },
      {
        "lng": 106.310063,
        "lat": -6.127031
      },
      {
        "lng": 106.308518,
        "lat": -6.123832
      },
      {
        "lng": 106.306825,
        "lat": -6.120503
      },
      {
        "lng": 106.305384,
        "lat": -6.117332
      },
      {
        "lng": 106.30382,
        "lat": -6.11433
      },
      {
        "lng": 106.302195,
        "lat": -6.111948
      },
      {
        "lng": 106.300131,
        "lat": -6.109196
      },
      {
        "lng": 106.296693,
        "lat": -6.107472
      },
      {
        "lng": 106.293458,
        "lat": -6.105733
      },
      {
        "lng": 106.290779,
        "lat": -6.104421
      },
      {
        "lng": 106.28532,
        "lat": -6.10688
      },
      {
        "lng": 106.2829,
        "lat": -6.108063
      },
      {
        "lng": 106.279182,
        "lat": -6.108562
      },
      {
        "lng": 106.27567,
        "lat": -6.10901
      },
      {
        "lng": 106.27217,
        "lat": -6.10921
      },
      {
        "lng": 106.267659,
        "lat": -6.109901
      },
      {
        "lng": 106.263792,
        "lat": -6.110459
      },
      {
        "lng": 106.259895,
        "lat": -6.110899
      },
      {
        "lng": 106.255781,
        "lat": -6.111438
      },
      {
        "lng": 106.252296,
        "lat": -6.111908
      },
      {
        "lng": 106.248244,
        "lat": -6.112333
      },
      {
        "lng": 106.244446,
        "lat": -6.112872
      },
      {
        "lng": 106.240692,
        "lat": -6.113263
      },
      {
        "lng": 106.237445,
        "lat": -6.112101
      },
      {
        "lng": 106.23453,
        "lat": -6.11055
      },
      {
        "lng": 106.23095,
        "lat": -6.10855
      },
      {
        "lng": 106.22803,
        "lat": -6.10764
      },
      {
        "lng": 106.223293,
        "lat": -6.106603
      },
      {
        "lng": 106.22043,
        "lat": -6.10524
      },
      {
        "lng": 106.21757,
        "lat": -6.1039
      },
      {
        "lng": 106.21412,
        "lat": -6.10263
      },
      {
        "lng": 106.210966,
        "lat": -6.100998
      },
      {
        "lng": 106.207872,
        "lat": -6.09974
      },
      {
        "lng": 106.205818,
        "lat": -6.097794
      },
      {
        "lng": 106.203751,
        "lat": -6.09548
      },
      {
        "lng": 106.200395,
        "lat": -6.094222
      },
      {
        "lng": 106.19829,
        "lat": -6.0916
      },
      {
        "lng": 106.19609,
        "lat": -6.08903
      },
      {
        "lng": 106.19386,
        "lat": -6.08656
      },
      {
        "lng": 106.19158,
        "lat": -6.08395
      },
      {
        "lng": 106.18908,
        "lat": -6.08104
      },
      {
        "lng": 106.18641,
        "lat": -6.07811
      },
      {
        "lng": 106.183668,
        "lat": -6.07542
      },
      {
        "lng": 106.18092,
        "lat": -6.074
      },
      {
        "lng": 106.17804,
        "lat": -6.07265
      },
      {
        "lng": 106.17538,
        "lat": -6.07147
      },
      {
        "lng": 106.17277,
        "lat": -6.07027
      },
      {
        "lng": 106.168395,
        "lat": -6.068451
      },
      {
        "lng": 106.165936,
        "lat": -6.067027
      },
      {
        "lng": 106.16288,
        "lat": -6.06513
      },
      {
        "lng": 106.15872,
        "lat": -6.06341
      },
      {
        "lng": 106.155549,
        "lat": -6.064474
      },
      {
        "lng": 106.153922,
        "lat": -6.06669
      },
      {
        "lng": 106.1508,
        "lat": -6.06731
      },
      {
        "lng": 106.14723,
        "lat": -6.06589
      },
      {
        "lng": 106.144815,
        "lat": -6.062789
      },
      {
        "lng": 106.14267,
        "lat": -6.06235
      },
      {
        "lng": 106.13869,
        "lat": -6.06199
      },
      {
        "lng": 106.13558,
        "lat": -6.06167
      },
      {
        "lng": 106.13175,
        "lat": -6.06144
      },
      {
        "lng": 106.13013,
        "lat": -6.05944
      },
      {
        "lng": 106.12726,
        "lat": -6.0562
      },
      {
        "lng": 106.124715,
        "lat": -6.053725
      },
      {
        "lng": 106.1224,
        "lat": -6.05095
      },
      {
        "lng": 106.11975,
        "lat": -6.04813
      },
      {
        "lng": 106.11707,
        "lat": -6.04523
      },
      {
        "lng": 106.11441,
        "lat": -6.04232
      },
      {
        "lng": 106.111816,
        "lat": -6.03931
      },
      {
        "lng": 106.10909,
        "lat": -6.03641
      },
      {
        "lng": 106.10666,
        "lat": -6.03366
      },
      {
        "lng": 106.103858,
        "lat": -6.030824
      },
      {
        "lng": 106.10419,
        "lat": -6.02806
      },
      {
        "lng": 106.101541,
        "lat": -6.025325
      },
      {
        "lng": 106.09833,
        "lat": -6.02337
      },
      {
        "lng": 106.09619,
        "lat": -6.020819
      },
      {
        "lng": 106.09699,
        "lat": -6.01795
      },
      {
        "lng": 106.0974,
        "lat": -6.0162
      },
      {
        "lng": 106.09806,
        "lat": -6.01349
      },
      {
        "lng": 106.09828,
        "lat": -6.01061
      },
      {
        "lng": 106.0984,
        "lat": -6.00647
      },
      {
        "lng": 106.09847,
        "lat": -6.00277
      },
      {
        "lng": 106.09857,
        "lat": -5.99923
      },
      {
        "lng": 106.095541,
        "lat": -5.997127
      },
      {
        "lng": 106.094551,
        "lat": -5.993304
      },
      {
        "lng": 106.097195,
        "lat": -5.990828
      },
      {
        "lng": 106.098318,
        "lat": -5.99029
      },
      {
        "lng": 106.099197,
        "lat": -5.990444
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.4222398,
        "lat": -6.199065
      },
      {
        "lng": 106.4216126,
        "lat": -6.1987895
      },
      {
        "lng": 106.4198616,
        "lat": -6.1961716
      },
      {
        "lng": 106.4194086,
        "lat": -6.1923474
      },
      {
        "lng": 106.4182677,
        "lat": -6.1880909
      },
      {
        "lng": 106.4181593,
        "lat": -6.184736
      },
      {
        "lng": 106.4184835,
        "lat": -6.1809279
      },
      {
        "lng": 106.4188076,
        "lat": -6.1770925
      },
      {
        "lng": 106.4190883,
        "lat": -6.1738994
      },
      {
        "lng": 106.4180044,
        "lat": -6.1706557
      },
      {
        "lng": 106.4179276,
        "lat": -6.1689557
      },
      {
        "lng": 106.4207485,
        "lat": -6.166217
      },
      {
        "lng": 106.4242601,
        "lat": -6.1649506
      },
      {
        "lng": 106.4276634,
        "lat": -6.1637387
      },
      {
        "lng": 106.4309042,
        "lat": -6.1625725
      },
      {
        "lng": 106.434488,
        "lat": -6.1613058
      },
      {
        "lng": 106.4377468,
        "lat": -6.1601394
      },
      {
        "lng": 106.4411515,
        "lat": -6.159461
      },
      {
        "lng": 106.4434722,
        "lat": -6.1589031
      },
      {
        "lng": 106.4473643,
        "lat": -6.1580696
      },
      {
        "lng": 106.4513858,
        "lat": -6.1583029
      },
      {
        "lng": 106.4549337,
        "lat": -6.1604546
      },
      {
        "lng": 106.4573468,
        "lat": -6.1639568
      },
      {
        "lng": 106.4614486,
        "lat": -6.1637919
      },
      {
        "lng": 106.4650128,
        "lat": -6.1653104
      },
      {
        "lng": 106.4693456,
        "lat": -6.1669896
      },
      {
        "lng": 106.4730003,
        "lat": -6.168553
      },
      {
        "lng": 106.476019,
        "lat": -6.168825
      },
      {
        "lng": 106.4786403,
        "lat": -6.1691523
      },
      {
        "lng": 106.4786119,
        "lat": -6.1719378
      },
      {
        "lng": 106.4785821,
        "lat": -6.1742348
      },
      {
        "lng": 106.4764494,
        "lat": -6.1773969
      },
      {
        "lng": 106.4758637,
        "lat": -6.1812419
      },
      {
        "lng": 106.4781963,
        "lat": -6.1849703
      },
      {
        "lng": 106.480154,
        "lat": -6.1870991
      },
      {
        "lng": 106.4826747,
        "lat": -6.1902029
      },
      {
        "lng": 106.4845388,
        "lat": -6.1911834
      },
      {
        "lng": 106.4832226,
        "lat": -6.1955188
      },
      {
        "lng": 106.4827653,
        "lat": -6.1967681
      },
      {
        "lng": 106.4863673,
        "lat": -6.1987747
      },
      {
        "lng": 106.4889961,
        "lat": -6.198496
      },
      {
        "lng": 106.4927581,
        "lat": -6.1995344
      },
      {
        "lng": 106.4946839,
        "lat": -6.1999359
      },
      {
        "lng": 106.4975591,
        "lat": -6.2005337
      },
      {
        "lng": 106.5007871,
        "lat": -6.2012571
      },
      {
        "lng": 106.502532,
        "lat": -6.2015596
      },
      {
        "lng": 106.5052992,
        "lat": -6.2023295
      },
      {
        "lng": 106.5079664,
        "lat": -6.2028464
      },
      {
        "lng": 106.5107607,
        "lat": -6.20358
      },
      {
        "lng": 106.5125693,
        "lat": -6.2040541
      },
      {
        "lng": 106.5147027,
        "lat": -6.2043735
      },
      {
        "lng": 106.5173334,
        "lat": -6.2047639
      },
      {
        "lng": 106.5198188,
        "lat": -6.2049015
      },
      {
        "lng": 106.520874,
        "lat": -6.206009
      },
      {
        "lng": 106.519697,
        "lat": -6.208103
      },
      {
        "lng": 106.519944,
        "lat": -6.210685
      },
      {
        "lng": 106.52032,
        "lat": -6.213653
      },
      {
        "lng": 106.520612,
        "lat": -6.216162
      },
      {
        "lng": 106.521033,
        "lat": -6.218767
      },
      {
        "lng": 106.521234,
        "lat": -6.221337
      },
      {
        "lng": 106.522579,
        "lat": -6.223471
      },
      {
        "lng": 106.52346,
        "lat": -6.224735
      },
      {
        "lng": 106.524328,
        "lat": -6.225716
      },
      {
        "lng": 106.523647,
        "lat": -6.2279
      },
      {
        "lng": 106.523639,
        "lat": -6.229499
      },
      {
        "lng": 106.523949,
        "lat": -6.232325
      },
      {
        "lng": 106.525518,
        "lat": -6.232805
      },
      {
        "lng": 106.527934,
        "lat": -6.233326
      },
      {
        "lng": 106.530646,
        "lat": -6.233877
      },
      {
        "lng": 106.533083,
        "lat": -6.234367
      },
      {
        "lng": 106.535856,
        "lat": -6.234948
      },
      {
        "lng": 106.538168,
        "lat": -6.235439
      },
      {
        "lng": 106.540713,
        "lat": -6.236023
      },
      {
        "lng": 106.543514,
        "lat": -6.236586
      },
      {
        "lng": 106.547309,
        "lat": -6.235231
      },
      {
        "lng": 106.551279,
        "lat": -6.233886
      },
      {
        "lng": 106.553625,
        "lat": -6.234291
      },
      {
        "lng": 106.555786,
        "lat": -6.234631
      },
      {
        "lng": 106.558439,
        "lat": -6.235106
      },
      {
        "lng": 106.561401,
        "lat": -6.235507
      },
      {
        "lng": 106.563586,
        "lat": -6.235952
      },
      {
        "lng": 106.565367,
        "lat": -6.236043
      },
      {
        "lng": 106.567419,
        "lat": -6.236123
      },
      {
        "lng": 106.569946,
        "lat": -6.23434
      },
      {
        "lng": 106.572018,
        "lat": -6.235539
      },
      {
        "lng": 106.574371,
        "lat": -6.236756
      },
      {
        "lng": 106.576974,
        "lat": -6.238093
      },
      {
        "lng": 106.578167,
        "lat": -6.238683
      },
      {
        "lng": 106.57947,
        "lat": -6.239395
      },
      {
        "lng": 106.5821192,
        "lat": -6.2408016
      },
      {
        "lng": 106.584679,
        "lat": -6.242173
      },
      {
        "lng": 106.587233,
        "lat": -6.243585
      },
      {
        "lng": 106.589314,
        "lat": -6.244726
      },
      {
        "lng": 106.591762,
        "lat": -6.246069
      },
      {
        "lng": 106.594426,
        "lat": -6.246154
      },
      {
        "lng": 106.596941,
        "lat": -6.246258
      },
      {
        "lng": 106.599863,
        "lat": -6.246359
      },
      {
        "lng": 106.602421,
        "lat": -6.246433
      },
      {
        "lng": 106.604964,
        "lat": -6.2466647
      },
      {
        "lng": 106.6073343,
        "lat": -6.2468701
      },
      {
        "lng": 106.609129,
        "lat": -6.247294
      },
      {
        "lng": 106.609628,
        "lat": -6.247031
      },
      {
        "lng": 106.611513,
        "lat": -6.247182
      },
      {
        "lng": 106.613612,
        "lat": -6.247311
      },
      {
        "lng": 106.616375,
        "lat": -6.245974
      },
      {
        "lng": 106.618926,
        "lat": -6.24477
      },
      {
        "lng": 106.621805,
        "lat": -6.24331
      },
      {
        "lng": 106.627001,
        "lat": -6.240783
      },
      {
        "lng": 106.6277071,
        "lat": -6.2389799
      },
      {
        "lng": 106.628398,
        "lat": -6.237172
      },
      {
        "lng": 106.629545,
        "lat": -6.2376
      },
      {
        "lng": 106.632859,
        "lat": -6.238785
      },
      {
        "lng": 106.635359,
        "lat": -6.239103
      },
      {
        "lng": 106.638946,
        "lat": -6.239548
      },
      {
        "lng": 106.641319,
        "lat": -6.239747
      },
      {
        "lng": 106.643607,
        "lat": -6.239879
      },
      {
        "lng": 106.64453,
        "lat": -6.238191
      },
      {
        "lng": 106.646177,
        "lat": -6.236973
      },
      {
        "lng": 106.64808,
        "lat": -6.235004
      },
      {
        "lng": 106.649603,
        "lat": -6.233419
      },
      {
        "lng": 106.650176,
        "lat": -6.231634
      },
      {
        "lng": 106.65117,
        "lat": -6.228977
      },
      {
        "lng": 106.652389,
        "lat": -6.226638
      },
      {
        "lng": 106.653614,
        "lat": -6.224542
      },
      {
        "lng": 106.654553,
        "lat": -6.222567
      },
      {
        "lng": 106.655758,
        "lat": -6.220546
      },
      {
        "lng": 106.65651,
        "lat": -6.218755
      },
      {
        "lng": 106.657763,
        "lat": -6.216917
      },
      {
        "lng": 106.658865,
        "lat": -6.215152
      },
      {
        "lng": 106.661297,
        "lat": -6.214808
      },
      {
        "lng": 106.663974,
        "lat": -6.214416
      },
      {
        "lng": 106.666669,
        "lat": -6.214019
      },
      {
        "lng": 106.669166,
        "lat": -6.213635
      },
      {
        "lng": 106.671827,
        "lat": -6.213206
      },
      {
        "lng": 106.674499,
        "lat": -6.212845
      },
      {
        "lng": 106.676823,
        "lat": -6.212489
      },
      {
        "lng": 106.679311,
        "lat": -6.212125
      },
      {
        "lng": 106.683958,
        "lat": -6.211505
      },
      {
        "lng": 106.686492,
        "lat": -6.211011
      },
      {
        "lng": 106.688918,
        "lat": -6.210568
      },
      {
        "lng": 106.691423,
        "lat": -6.210288
      },
      {
        "lng": 106.693669,
        "lat": -6.209264
      },
      {
        "lng": 106.696033,
        "lat": -6.208148
      },
      {
        "lng": 106.698675,
        "lat": -6.206271
      },
      {
        "lng": 106.700231,
        "lat": -6.205273
      },
      {
        "lng": 106.70251,
        "lat": -6.203722
      },
      {
        "lng": 106.704488,
        "lat": -6.202343
      },
      {
        "lng": 106.706341,
        "lat": -6.200933
      },
      {
        "lng": 106.708366,
        "lat": -6.199411
      },
      {
        "lng": 106.710771,
        "lat": -6.197396
      },
      {
        "lng": 106.711759,
        "lat": -6.194768
      },
      {
        "lng": 106.712679,
        "lat": -6.192577
      },
      {
        "lng": 106.715658,
        "lat": -6.190008
      },
      {
        "lng": 106.717085,
        "lat": -6.188882
      },
      {
        "lng": 106.719203,
        "lat": -6.187348
      },
      {
        "lng": 106.7197013,
        "lat": -6.1877013
      }
    ]
  },
  {
    "name": "Unnamed",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7873715,
        "lat": -6.3458745
      },
      {
        "lng": 106.7874167,
        "lat": -6.3452933
      },
      {
        "lng": 106.7865333,
        "lat": -6.3449956
      },
      {
        "lng": 106.7854232,
        "lat": -6.3462988
      },
      {
        "lng": 106.7845528,
        "lat": -6.3478038
      },
      {
        "lng": 106.7829978,
        "lat": -6.3504655
      },
      {
        "lng": 106.7819515,
        "lat": -6.3522896
      },
      {
        "lng": 106.780808,
        "lat": -6.3543415
      },
      {
        "lng": 106.7793907,
        "lat": -6.3567986
      },
      {
        "lng": 106.7776549,
        "lat": -6.3578163
      },
      {
        "lng": 106.7753182,
        "lat": -6.3590969
      },
      {
        "lng": 106.7735991,
        "lat": -6.3600938
      },
      {
        "lng": 106.7718914,
        "lat": -6.3622167
      },
      {
        "lng": 106.7704513,
        "lat": -6.3639819
      },
      {
        "lng": 106.7681212,
        "lat": -6.3668924
      },
      {
        "lng": 106.7663897,
        "lat": -6.3690854
      },
      {
        "lng": 106.7642386,
        "lat": -6.3717491
      },
      {
        "lng": 106.7618863,
        "lat": -6.3747445
      },
      {
        "lng": 106.7601453,
        "lat": -6.3769409
      },
      {
        "lng": 106.7586591,
        "lat": -6.37881
      },
      {
        "lng": 106.7563905,
        "lat": -6.3788117
      },
      {
        "lng": 106.7535761,
        "lat": -6.3788063
      },
      {
        "lng": 106.7504181,
        "lat": -6.378753
      },
      {
        "lng": 106.7478693,
        "lat": -6.3787625
      },
      {
        "lng": 106.7443646,
        "lat": -6.3787491
      },
      {
        "lng": 106.7407037,
        "lat": -6.3786824
      },
      {
        "lng": 106.7368465,
        "lat": -6.3786484
      },
      {
        "lng": 106.7361247,
        "lat": -6.3757204
      },
      {
        "lng": 106.7354412,
        "lat": -6.3727895
      },
      {
        "lng": 106.7346183,
        "lat": -6.3693673
      },
      {
        "lng": 106.7339597,
        "lat": -6.3665468
      },
      {
        "lng": 106.7331225,
        "lat": -6.363023
      },
      {
        "lng": 106.7324011,
        "lat": -6.3603266
      },
      {
        "lng": 106.7303141,
        "lat": -6.3566211
      },
      {
        "lng": 106.7288727,
        "lat": -6.3541251
      },
      {
        "lng": 106.7274204,
        "lat": -6.35157
      },
      {
        "lng": 106.725688,
        "lat": -6.3485723
      },
      {
        "lng": 106.7238716,
        "lat": -6.345433
      },
      {
        "lng": 106.7238849,
        "lat": -6.341873
      },
      {
        "lng": 106.7239123,
        "lat": -6.3378623
      },
      {
        "lng": 106.7239182,
        "lat": -6.3351492
      },
      {
        "lng": 106.7239304,
        "lat": -6.3317382
      },
      {
        "lng": 106.7239506,
        "lat": -6.3281038
      },
      {
        "lng": 106.723954,
        "lat": -6.3248327
      },
      {
        "lng": 106.7232766,
        "lat": -6.3219027
      },
      {
        "lng": 106.7225534,
        "lat": -6.318947
      },
      {
        "lng": 106.7218486,
        "lat": -6.315972
      },
      {
        "lng": 106.7209411,
        "lat": -6.3123544
      },
      {
        "lng": 106.7199469,
        "lat": -6.308582
      },
      {
        "lng": 106.7191223,
        "lat": -6.3049216
      },
      {
        "lng": 106.7184061,
        "lat": -6.3016683
      },
      {
        "lng": 106.7175663,
        "lat": -6.2978306
      },
      {
        "lng": 106.7167674,
        "lat": -6.2944256
      },
      {
        "lng": 106.7160299,
        "lat": -6.2913311
      },
      {
        "lng": 106.7154178,
        "lat": -6.2885646
      },
      {
        "lng": 106.7145923,
        "lat": -6.2853337
      },
      {
        "lng": 106.7139126,
        "lat": -6.2823924
      },
      {
        "lng": 106.7132716,
        "lat": -6.2794474
      },
      {
        "lng": 106.7127262,
        "lat": -6.277064
      },
      {
        "lng": 106.7118769,
        "lat": -6.273331
      },
      {
        "lng": 106.7111143,
        "lat": -6.2701965
      },
      {
        "lng": 106.7103313,
        "lat": -6.2668514
      },
      {
        "lng": 106.7095109,
        "lat": -6.2631315
      },
      {
        "lng": 106.7088402,
        "lat": -6.2604578
      },
      {
        "lng": 106.7082148,
        "lat": -6.2575613
      },
      {
        "lng": 106.7072921,
        "lat": -6.2535955
      },
      {
        "lng": 106.7065062,
        "lat": -6.2500312
      },
      {
        "lng": 106.7056522,
        "lat": -6.2467314
      },
      {
        "lng": 106.7048182,
        "lat": -6.2434967
      },
      {
        "lng": 106.703957,
        "lat": -6.2400238
      },
      {
        "lng": 106.7032325,
        "lat": -6.2370659
      },
      {
        "lng": 106.7016695,
        "lat": -6.2337219
      },
      {
        "lng": 106.7001462,
        "lat": -6.2303928
      },
      {
        "lng": 106.6986356,
        "lat": -6.2272104
      },
      {
        "lng": 106.6972322,
        "lat": -6.2242089
      },
      {
        "lng": 106.6982905,
        "lat": -6.2223031
      },
      {
        "lng": 106.7001261,
        "lat": -6.219001
      },
      {
        "lng": 106.7015019,
        "lat": -6.2164075
      },
      {
        "lng": 106.7034496,
        "lat": -6.2128258
      },
      {
        "lng": 106.7046232,
        "lat": -6.2107593
      },
      {
        "lng": 106.7061542,
        "lat": -6.2079407
      },
      {
        "lng": 106.7078936,
        "lat": -6.2047995
      },
      {
        "lng": 106.7095845,
        "lat": -6.2017514
      },
      {
        "lng": 106.7123039,
        "lat": -6.1993708
      },
      {
        "lng": 106.71489,
        "lat": -6.1970986
      },
      {
        "lng": 106.7168056,
        "lat": -6.1954299
      },
      {
        "lng": 106.7190112,
        "lat": -6.1934578
      },
      {
        "lng": 106.7196508,
        "lat": -6.1911966
      },
      {
        "lng": 106.7196106,
        "lat": -6.1896888
      },
      {
        "lng": 106.7199444,
        "lat": -6.188925
      },
      {
        "lng": 106.7197527,
        "lat": -6.1885514
      }
    ]
  },
  {
    "name": "Jalur SUTET Muarakarang-Durikosambi",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7247231,
        "lat": -6.172409
      },
      {
        "lng": 106.7254149,
        "lat": -6.1723737
      },
      {
        "lng": 106.7265221,
        "lat": -6.1715052
      },
      {
        "lng": 106.7285154,
        "lat": -6.170569
      },
      {
        "lng": 106.7290794,
        "lat": -6.1701113
      },
      {
        "lng": 106.7301109,
        "lat": -6.1679557
      },
      {
        "lng": 106.7312954,
        "lat": -6.1653852
      },
      {
        "lng": 106.7325247,
        "lat": -6.1629163
      },
      {
        "lng": 106.7336925,
        "lat": -6.1604632
      },
      {
        "lng": 106.7350064,
        "lat": -6.1577076
      },
      {
        "lng": 106.7360613,
        "lat": -6.15534
      },
      {
        "lng": 106.73677,
        "lat": -6.15398
      },
      {
        "lng": 106.73784,
        "lat": -6.15234
      },
      {
        "lng": 106.7396385,
        "lat": -6.1501318
      },
      {
        "lng": 106.7413532,
        "lat": -6.1480192
      },
      {
        "lng": 106.7430335,
        "lat": -6.1457665
      },
      {
        "lng": 106.7448763,
        "lat": -6.1434716
      },
      {
        "lng": 106.746804,
        "lat": -6.1411181
      },
      {
        "lng": 106.7485545,
        "lat": -6.1388745
      },
      {
        "lng": 106.7503842,
        "lat": -6.1365737
      },
      {
        "lng": 106.75231,
        "lat": -6.13407
      },
      {
        "lng": 106.75275,
        "lat": -6.1313
      },
      {
        "lng": 106.7525,
        "lat": -6.12872
      },
      {
        "lng": 106.75223,
        "lat": -6.12585
      },
      {
        "lng": 106.75199,
        "lat": -6.12304
      },
      {
        "lng": 106.75171,
        "lat": -6.1199
      },
      {
        "lng": 106.7513827,
        "lat": -6.1173246
      },
      {
        "lng": 106.75127,
        "lat": -6.11436
      },
      {
        "lng": 106.75357,
        "lat": -6.11313
      },
      {
        "lng": 106.756,
        "lat": -6.11172
      },
      {
        "lng": 106.75841,
        "lat": -6.1104
      },
      {
        "lng": 106.7610291,
        "lat": -6.1089541
      },
      {
        "lng": 106.7633864,
        "lat": -6.1076613
      },
      {
        "lng": 106.7659002,
        "lat": -6.1063003
      },
      {
        "lng": 106.7686248,
        "lat": -6.1062287
      },
      {
        "lng": 106.7713705,
        "lat": -6.1072213
      },
      {
        "lng": 106.774011,
        "lat": -6.1081678
      },
      {
        "lng": 106.77732,
        "lat": -6.10937
      },
      {
        "lng": 106.7807488,
        "lat": -6.1106778
      },
      {
        "lng": 106.7814808,
        "lat": -6.1107523
      }
    ]
  },
  {
    "name": "SUTET Durikosambi - Kembangan",
    "type": "other",
    "color": "#94a3b8",
    "path": [
      {
        "lng": 106.7247887,
        "lat": -6.173039
      },
      {
        "lng": 106.725541,
        "lat": -6.172895
      },
      {
        "lng": 106.7276389,
        "lat": -6.1733494
      },
      {
        "lng": 106.7281357,
        "lat": -6.1792717
      },
      {
        "lng": 106.7288297,
        "lat": -6.1821432
      },
      {
        "lng": 106.7295284,
        "lat": -6.184841
      },
      {
        "lng": 106.7302883,
        "lat": -6.1877028
      },
      {
        "lng": 106.7310955,
        "lat": -6.19081
      },
      {
        "lng": 106.7285522,
        "lat": -6.1905422
      },
      {
        "lng": 106.7253423,
        "lat": -6.1900601
      },
      {
        "lng": 106.7230357,
        "lat": -6.1904185
      },
      {
        "lng": 106.7207176,
        "lat": -6.1910917
      },
      {
        "lng": 106.7196508,
        "lat": -6.1911966
      },
      {
        "lng": 106.7196144,
        "lat": -6.1896743
      },
      {
        "lng": 106.7199444,
        "lat": -6.188925
      },
      {
        "lng": 106.7202796,
        "lat": -6.188445
      }
    ]
  }
];
