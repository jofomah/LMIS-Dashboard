exports.stockCounts = [
  {
    "_id": "sc-1",
    "countDate": "2016-09-22",
    "programId": "program:ri",
    "facilityId": "ntf@a.org",
    "productCounts": [
      {
        "_id": "product-profile:2ml-dil-syr",
        "base_uom": "uom:unit",
        "count": 873
      },
      {
        "_id": "product-profile:opv-10",
        "base_uom": "uom:dose",
        "count": 290
      }
    ],
    "doc_type": "stock-count",
    "created": "2016-09-12T03:34:35.548Z"
  },
  {
    "_id": "sc-2",
    "countDate": "2016-09-12",
    "programId": "program:ri",
    "facilityId": "ntf@a.org",
    "productCounts": [
      {
        "_id": "product-profile:2ml-dil-syr",
        "base_uom": "uom:unit",
        "count": 873
      },
      {
        "_id": "product-profile:opv-10",
        "base_uom": "uom:dose",
        "count": 290
      }
    ],
    "doc_type": "stock-count",
    "created": "2016-09-22T13:34:35.548Z"
  },
  {
    "_id": "sc-3",
    "countDate": "2016-09-29",
    "programId": "program:ri",
    "facilityId": "ntf@a.org",
    "productCounts": [
      {
        "_id": "product-profile:2ml-dil-syr",
        "base_uom": "uom:unit",
        "count": 873
      },
      {
        "_id": "product-profile:opv-10",
        "base_uom": "uom:dose",
        "count": 290
      }
    ],
    "doc_type": "stock-count",
    "created": "2016-09-29T13:34:35.548Z"
  }
];

exports.expectedProductCounts = [
  {
    "_id": "product-profile:2ml-dil-syr",
    "base_uom": "uom:unit",
    "count": 873,
    "productType": {
      "_id": "product-type:syr-dil-2ml",
      "code": "Syr-Dil-2ml"
    },
    "name": "2ml Dil. Syringe",
    "uom": {
      "_id": "uom:unit",
      "name": "Unit"
    }
  },
  {
    "_id": "product-profile:opv-10",
    "base_uom": "uom:dose",
    "count": 290,
    "productType": {
      "_id": "product-type:opv",
      "code": "OPV"
    },
    "name": "OPV 10",
    "uom": {
      "_id": "uom:dose",
      "name": "Dose"
    }
  }
];

exports.expectedFacilityStocks = [
  {
    "_id": "31b1ba1af2e8bcce4a890f1e580110ff",
    "facility": {
      "name": "New Test HF",
      "_id": "ntf@a.org",
      "ancestors": [
        {
          "level": 0,
          "_id": "NG",
          "name": "Nigeria"
        },
        {
          "level": 1,
          "_id": "NG-KN",
          "name": "Kano"
        },
        {
          "level": 2,
          "_id": "NG-KN-NASSARAWA",
          "name": "Nassarawa"
        },
        {
          "level": 3,
          "_id": "NG-KN-NASSARAWA-Fagge",
          "name": "Fagge"
        },
        {
          "level": 4,
          "_id": "NG-KN-NASSARAWA-Fagge-B",
          "name": "Fagge B"
        }
      ]
    },
    "countDate": "2016-09-12",
    "created": "2016-09-12T12:12:56.000Z",
    "programProducts": [
      {
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "minLevel": 80,
        "reorderLevel": 270,
        "maxLevel": 320
      },
      {
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "minLevel": 640,
        "reorderLevel": 270,
        "maxLevel": 1000
      }
    ],
    "productCounts": [
      {
        "_id": "product-profile:2ml-dil-syr",
        "base_uom": "uom:unit",
        "count": 873,
        "productType": {
          "_id": "product-type:syr-dil-2ml",
          "code": "Syr-Dil-2ml"
        },
        "name": "2ml Dil. Syringe",
        "uom": {
          "_id": "uom:unit",
          "name": "Unit"
        }
      },
      {
        "_id": "product-profile:opv-10",
        "base_uom": "uom:dose",
        "count": 290,
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "name": "OPV 10",
        "uom": {
          "_id": "uom:dose",
          "name": "Dose"
        }
      }
    ]
  },
  {
    "_id": "sc-2",
    "facility": {
      "name": "New Test HF",
      "_id": "ntf@a.org",
      "ancestors": [
        {
          "level": 0,
          "_id": "NG",
          "name": "Nigeria"
        },
        {
          "level": 1,
          "_id": "NG-KN",
          "name": "Kano"
        },
        {
          "level": 2,
          "_id": "NG-KN-NASSARAWA",
          "name": "Nassarawa"
        },
        {
          "level": 3,
          "_id": "NG-KN-NASSARAWA-Fagge",
          "name": "Fagge"
        },
        {
          "level": 4,
          "_id": "NG-KN-NASSARAWA-Fagge-B",
          "name": "Fagge B"
        }
      ]
    },
    "countDate": "2016-09-13",
    "created": "2016-09-13T12:07:56.000Z",
    "programProducts": [
      {
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "minLevel": 80,
        "reorderLevel": 270,
        "maxLevel": 320
      },
      {
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "minLevel": 640,
        "reorderLevel": 270,
        "maxLevel": 1000
      }
    ],
    "productCounts": [
      {
        "_id": "product-profile:2ml-dil-syr",
        "base_uom": "uom:unit",
        "count": 873,
        "productType": {
          "_id": "product-type:syr-dil-2ml",
          "code": "Syr-Dil-2ml"
        },
        "name": "2ml Dil. Syringe",
        "uom": {
          "_id": "uom:unit",
          "name": "Unit"
        }
      },
      {
        "_id": "product-profile:opv-10",
        "base_uom": "uom:dose",
        "count": 290,
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "name": "OPV 10",
        "uom": {
          "_id": "uom:dose",
          "name": "Dose"
        }
      }
    ]
  },
  {
    "_id": "sc-3",
    "facility": {
      "name": "New Test HF",
      "_id": "ntf@a.org",
      "ancestors": [
        {
          "level": 0,
          "_id": "NG",
          "name": "Nigeria"
        },
        {
          "level": 1,
          "_id": "NG-KN",
          "name": "Kano"
        },
        {
          "level": 2,
          "_id": "NG-KN-NASSARAWA",
          "name": "Nassarawa"
        },
        {
          "level": 3,
          "_id": "NG-KN-NASSARAWA-Fagge",
          "name": "Fagge"
        },
        {
          "level": 4,
          "_id": "NG-KN-NASSARAWA-Fagge-B",
          "name": "Fagge B"
        }
      ]
    },
    "countDate": "2016-09-13",
    "created": "2016-09-13T12:12:56.000Z",
    "programProducts": [
      {
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "minLevel": 80,
        "reorderLevel": 270,
        "maxLevel": 320
      },
      {
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "minLevel": 640,
        "reorderLevel": 270,
        "maxLevel": 1000
      }
    ],
    "productCounts": [
      {
        "_id": "product-profile:2ml-dil-syr",
        "base_uom": "uom:unit",
        "count": 873,
        "productType": {
          "_id": "product-type:syr-dil-2ml",
          "code": "Syr-Dil-2ml"
        },
        "name": "2ml Dil. Syringe",
        "uom": {
          "_id": "uom:unit",
          "name": "Unit"
        }
      },
      {
        "_id": "product-profile:opv-10",
        "base_uom": "uom:dose",
        "count": 290,
        "productType": {
          "_id": "product-type:opv",
          "code": "OPV"
        },
        "name": "OPV 10",
        "uom": {
          "_id": "uom:dose",
          "name": "Dose"
        }
      }
    ]
  }
]

