[0, 1, 2, 3, 4].reduce(
  function (
    accumulator,
    currentValue,
    currentIndex,
    array
  ) {
    return accumulator + currentValue;
  }
);

let sfdxPackages = [{
    "path": "force-app/dreamhouse-schema",
    "id": "0Ho7F000000blJiSAI",
    "versionName": "v 0.1",
    "versionDescription": "ver 0.1",
    "versionNumber": "0.1.0.NEXT",
    "ancestorId": "",
    "features": "ExternalSharing"
  },
  {
    "path": "force-app/dreamhouse-bl",
    "id": "0Ho500000004C98Czz",
    "versionName": "v 0.3",
    "versionDescription": "ver 0.3",
    "versionNumber": "0.3.0.NEXT",
    "ancestorId": "",
    "dependencies": [{
      "packageId": "0Ho500000004C93CAE",
      "versionNumber": "0.1.0.LATEST"
    }],
    "features": "MultiCurrency",
    "orgPreferences": {
      "enabled": [
        "S1DesktopEnabled",
        "Translation"
      ],
      "disabled": []
    }
  },
  {
    "path": "force-app/dreamhouse-ui",
    "id": "0Ho500000004C9DCyy",
    "versionName": "v 1.6",
    "versionDescription": "ver 1.6",
    "versionNumber": "1.6.0.NEXT",
    "ancestorId": "",
    "dependencies": [{
      "packageId": "0Ho500000004C93CAE",
      "versionNumber": "1.6.0.LATEST"
    }]
  },
  {
    "path": "force-app/dreamhouse-perms",
    "default": true,
    "id": "0Ho500000004C9DCA?",
    "versionName": "v 0.5",
    "versionDescription": "ver 0.5",
    "versionNumber": "0.5.0.NEXT",
    "ancestorId": "",
    "dependencies": [{
      "packageId": "0Ho500000004C93CAE",
      "versionNumber": "0.5.0.LATEST"
    }]
  }
];
