import { LanguageCode, Permission } from '@vendure/common/lib/generated-types';

import { CrudPermissionDefinition, PermissionDefinition, PermissionMetadata } from './permission-definition';

/**
 * This value should be rarely used - only in those contexts where we have no access to the
 * VendureConfig to ensure at least a valid LanguageCode is available.
 */
export const DEFAULT_LANGUAGE_CODE = LanguageCode.en;
export const TRANSACTION_MANAGER_KEY = Symbol('TRANSACTION_MANAGER');
export const REQUEST_CONTEXT_KEY = 'vendureRequestContext';
export const REQUEST_CONTEXT_MAP_KEY = 'vendureRequestContextMap';
export const DEFAULT_PERMISSIONS: PermissionDefinition[] = [
    new PermissionDefinition({
        name: 'Authenticated',
        description: 'Authenticated means simply that the user is logged in',
        assignable: true,
        internal: true,
    }),
    new PermissionDefinition({
        name: 'SuperAdmin',
        description: 'SuperAdmin has unrestricted access to all operations',
        assignable: true,
        internal: true,
    }),
    new PermissionDefinition({
        name: 'Owner',
        description: "Owner means the user owns this entity, e.g. a Customer's own Order",
        assignable: false,
        internal: true,
    }),
    new PermissionDefinition({
        name: 'Public',
        description: 'Public means any unauthenticated user may perform the operation',
        assignable: false,
        internal: true,
    }),
    new PermissionDefinition({
        name: 'UpdateGlobalSettings',
        description: 'Grants permission to update GlobalSettings',
        assignable: true,
        internal: false,
    }),
    new CrudPermissionDefinition(
        'Catalog',
        operation => `Grants permission to ${operation} Products, Facets, Assets, Collections`,
    ),
    new CrudPermissionDefinition(
        'Settings',
        operation =>
            `Grants permission to ${operation} PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings`,
    ),
    new CrudPermissionDefinition('Administrator'),
    new CrudPermissionDefinition('Asset'),
    new CrudPermissionDefinition('Channel'),
    new CrudPermissionDefinition('Collection'),
    new CrudPermissionDefinition('Country'),
    new CrudPermissionDefinition('Customer'),
    new CrudPermissionDefinition('CustomerGroup'),
    new CrudPermissionDefinition('Facet'),
    new CrudPermissionDefinition('Order'),
    new CrudPermissionDefinition('PaymentMethod'),
    new CrudPermissionDefinition('Product'),
    new CrudPermissionDefinition('Promotion'),
    new CrudPermissionDefinition('ShippingMethod'),
    new CrudPermissionDefinition('Tag'),
    new CrudPermissionDefinition('TaxCategory'),
    new CrudPermissionDefinition('TaxRate'),
    new CrudPermissionDefinition('Seller'),
    new CrudPermissionDefinition('StockLocation'),
    new CrudPermissionDefinition('System'),
    new CrudPermissionDefinition('Zone'),
];

export function getAllPermissionsMetadata(customPermissions: PermissionDefinition[]): PermissionMetadata[] {
    const allPermissions = [...DEFAULT_PERMISSIONS, ...customPermissions];
    return allPermissions.reduce((all, def) => [...all, ...def.getMetadata()], [] as PermissionMetadata[]);
}

export const CacheKey = {
    GlobalSettings: 'GlobalSettings',
    AllZones: 'AllZones',
    ActiveTaxZone: 'ActiveTaxZone',
    ActiveTaxZone_PPA: 'ActiveTaxZone_PPA',
};

export enum DEFAULT_ZONES {
    ASIA = 'Asia',
    EUROPE = 'Europe',
    AMERICAS = 'Americas',
    AFRICA = 'Africa',
    OCEANIA = 'Oceania',
}

// In RoleService (used by createShopAdminRole())
export const SHOP_ADMIN_PERMISSIONS: Permission[] = [
    // Read and Create Administrator
    Permission.CreateAdministrator,
    Permission.ReadAdministrator,
    Permission.UpdateAdministrator,
    Permission.DeleteAdministrator,

    // Catalog and merchandising
    Permission.CreateCatalog,
    Permission.ReadCatalog,
    Permission.UpdateCatalog,
    Permission.DeleteCatalog,
    Permission.CreateProduct,
    Permission.ReadProduct,
    Permission.UpdateProduct,
    Permission.DeleteProduct,
    Permission.CreateCollection,
    Permission.ReadCollection,
    Permission.UpdateCollection,
    Permission.DeleteCollection,
    Permission.CreateFacet,
    Permission.ReadFacet,
    Permission.UpdateFacet,
    Permission.DeleteFacet,
    Permission.CreateAsset,
    Permission.ReadAsset,
    Permission.UpdateAsset,
    Permission.DeleteAsset,
    Permission.CreateTag,
    Permission.ReadTag,
    Permission.UpdateTag,
    Permission.DeleteTag,

    // Orders and customers
    Permission.CreateOrder,
    Permission.ReadOrder,
    Permission.UpdateOrder,
    Permission.DeleteOrder,
    Permission.CreateCustomer,
    Permission.ReadCustomer,
    Permission.UpdateCustomer,
    Permission.DeleteCustomer,
    Permission.CreateCustomerGroup,
    Permission.ReadCustomerGroup,
    Permission.UpdateCustomerGroup,
    Permission.DeleteCustomerGroup,

    // Promotions
    Permission.CreatePromotion,
    Permission.ReadPromotion,
    Permission.UpdatePromotion,
    Permission.DeletePromotion,

    // Shipping and payments (if per-shop managed)
    Permission.CreateShippingMethod,
    Permission.ReadShippingMethod,
    Permission.UpdateShippingMethod,
    Permission.DeleteShippingMethod,
    Permission.CreatePaymentMethod,
    Permission.ReadPaymentMethod,
    Permission.UpdatePaymentMethod,
    Permission.DeletePaymentMethod,

    // Tax/country/zone management (if per-shop)
    Permission.CreateTaxCategory,
    Permission.ReadTaxCategory,
    Permission.UpdateTaxCategory,
    Permission.DeleteTaxCategory,
    Permission.CreateTaxRate,
    Permission.ReadTaxRate,
    Permission.UpdateTaxRate,
    Permission.DeleteTaxRate,
    Permission.CreateCountry,
    Permission.ReadCountry,
    Permission.UpdateCountry,
    Permission.DeleteCountry,
    Permission.CreateZone,
    Permission.ReadZone,
    Permission.UpdateZone,
    Permission.DeleteZone,

    // Inventory and sellers (if applicable to shop)
    Permission.CreateStockLocation,
    Permission.ReadStockLocation,
    Permission.UpdateStockLocation,
    Permission.DeleteStockLocation,
    Permission.CreateSeller,
    Permission.ReadSeller,
    Permission.UpdateSeller,
    Permission.DeleteSeller,

    // Channel management within their shop
    Permission.CreateChannel,
    Permission.ReadChannel,
    Permission.UpdateChannel,
    // Intentionally exclude Permission.DeleteChannel unless you want to allow it
];
