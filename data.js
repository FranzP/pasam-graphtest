var workflow = {
  PasAMOrderStateModelVersion: '2.0',
  CreationDate: '03.12.2020',
  Author: 'mschlestein',
  Customer: 'HELLA',
  Name: 'CountingStateModel',
  DefaultInitialState: 'Active',
  DefaultErrorPipeline: 'HELLA.CommonPipelines#DefaultErrorPipeline',
  AvailableStates: {
    Deleted: { IsHiddenInPortal: true },
    Cancelled: { IsHiddenInPortal: true, AllowArchiving: true },
    Rejected: { IsHiddenInPortal: true, AllowArchiving: true },
    Active: {
      IsHiddenInPortal: true,
      AllowChanges: true,
      AllowPosting: true,
      AllowMobileSync: true,
    },
    SplitScrappedAssets: {
      EnterActionPipeline: [
        {
          Name: 'SplitItemsIntoSeparateRequest',
          Parameters: {
            FilterFunc: 'ConfirmationStateEqualsScrapped',
            RequestType: 'HELLA.Counting',
            TargetState: 'SCRAP_JumpToScrapping',
            TitleTextKey: 'AM.WEB.INVENTORY.SCRAPPING.TITLE',
            Lang: 'EN',
          },
        },
        { Name: 'AutoConfirm' },
      ],
    },
    SplitOrderByCostCenters: {
      EnterActionPipeline: [
        {
          Name: 'SplitItemsIntoSeparateRequest',
          Parameters: {
            FilterFunc: 'ContainsCostCenterChange',
            RequestType: 'HELLA.Counting',
            TargetState: 'MOV_SplitSuperEquipmentChanges',
            TargetCostcenterParam: 'targetCostCenter',
            TitleTextKey: 'AM.WEB.INVENTORY.MOVEMENT.TITLE',
            Lang: 'EN',
          },
        },
        { Name: 'AutoConfirm' },
      ],
    },
    SplitSuperEquipmentChanges: {
      EnterActionPipeline: [
        {
          Name: 'SplitItemsIntoSeparateRequest',
          Parameters: {
            FilterFunc: 'SplitOnFieldChange',
            FieldName: 'Field45',
            HeaderParam: 'targetEquipment',
            RequestType: 'HELLA.Counting',
            TargetState: 'MOV_SplitFunctionalLocationChanges',
            TitleTextKey: 'AM.WEB.INVENTORY.MOVEEQUIPMENT.TITLE',
            Lang: 'EN',
          },
        },
        { Name: 'AutoConfirm' },
      ],
    },
    MOV_SplitSuperEquipmentChanges: {
      EnterActionPipeline: [
        {
          Name: 'SplitItemsIntoSeparateRequest',
          Parameters: {
            FilterFunc: 'SplitOnFieldChange',
            FieldName: 'Field45',
            HeaderParam: 'targetEquipment',
            RequestType: 'HELLA.Counting',
            TargetState: 'MOV_SplitFunctionalLocationChanges',
            TitleTextKey: 'AM.WEB.INVENTORY.MOVEEQUIPMENT.TITLE',
            Lang: 'EN',
          },
        },
        { Name: 'AutoConfirm' },
      ],
    },
    SplitFunctionalLocationChanges: {
      EnterActionPipeline: [
        {
          Name: 'SplitItemsIntoSeparateRequest',
          Parameters: {
            FilterFunc: 'SplitOnFieldChange',
            FieldName: 'Field46',
            HeaderParam: 'targetFunctionalLocation',
            RequestType: 'HELLA.Counting',
            TargetState: 'MOV_JumpToMovementAM',
            TitleTextKey: 'AM.WEB.INVENTORY.MOVEEQUIPMENT.TITLE',
            Lang: 'EN',
          },
        },
        { Name: 'AutoConfirm' },
      ],
    },
    MOV_SplitFunctionalLocationChanges: {
      EnterActionPipeline: [
        {
          Name: 'SplitItemsIntoSeparateRequest',
          Parameters: {
            FilterFunc: 'SplitOnFieldChange',
            FieldName: 'Field46',
            HeaderParam: 'targetFunctionalLocation',
            RequestType: 'HELLA.Counting',
            TargetState: 'MOV_JumpToMovementAM',
            TitleTextKey: 'AM.WEB.INVENTORY.MOVEEQUIPMENT.TITLE',
            Lang: 'EN',
          },
        },
        { Name: 'AutoConfirm' },
      ],
    },
    MOV_JumpToMovementAM: {
      EnterActionPipeline: [
        { Name: 'HELLA.AppendEquipments' },
        {
          Name: 'ChangeRequestType',
          Parameters: {
            RequestType: 'HELLA.MovementAM',
            TargetState: 'SplitOrderByCostCentersIfNecessary',
          },
        },
      ],
    },
    SCRAP_JumpToScrapping: {
      EnterActionPipeline: [
        { Name: 'HELLA.AppendEquipments' },
        {
          Name: 'ChangeRequestType',
          Parameters: {
            RequestType: 'HELLA.Scrapping',
            TargetState: 'ComingFromInventory_SplitByCostCenters',
          },
        },
      ],
    },
    ActiveConsoleOnly: {
      IsHiddenInPortal: true,
      AllowChanges: true,
      AllowPosting: true,
    },
    Closed: { IsHiddenInPortal: true, AllowArchiving: true },
  },
  AllowedTransfers: [
    { From: 'Cancelled', To: 'Deleted' },
    { From: 'Cancelled', To: 'Active' },
    { From: 'Cancelled', To: 'ActiveConsoleOnly' },

    { From: 'Rejected', To: 'Deleted' },
    { From: 'Rejected', To: 'Active' },
    { From: 'Rejected', To: 'ActiveConsoleOnly' },

    {
      From: 'Active',
      To: 'Cancelled',
      Constraints: [{ Name: 'NoPostedAssetsAllowed' }],
    },
    {
      From: 'Active',
      To: 'Rejected',
      Constraints: [{ Name: 'NoPostedAssetsAllowed' }],
    },
    { From: 'Active', To: 'SplitScrappedAssets' },

    { From: 'SplitScrappedAssets', To: 'SplitOrderByCostCenters' },

    { From: 'SplitOrderByCostCenters', To: 'SplitSuperEquipmentChanges' },

    {
      From: 'SplitSuperEquipmentChanges',
      To: 'SplitFunctionalLocationChanges',
    },

    { From: 'SplitFunctionalLocationChanges', To: 'ActiveConsoleOnly' },

    {
      From: 'MOV_SplitSuperEquipmentChanges',
      To: 'MOV_SplitFunctionalLocationChanges',
    },
    { From: 'MOV_SplitFunctionalLocationChanges', To: 'MOV_JumpToMovementAM' },

    {
      From: 'ActiveConsoleOnly',
      To: 'Cancelled',
      Constraints: [{ Name: 'NoPostedAssetsAllowed' }],
    },
    {
      From: 'ActiveConsoleOnly',
      To: 'Rejected',
      Constraints: [{ Name: 'NoPostedAssetsAllowed' }],
    },
    { From: 'ActiveConsoleOnly', To: 'Active' },
    { From: 'ActiveConsoleOnly', To: 'Closed' },

    { From: 'Closed', To: 'Active' },
    { From: 'Closed', To: 'ActiveConsoleOnly' },
  ],
};
