export interface CustomerInfoFormData {
    emailAddress: string;
    firstName: string;
    lastName: string;
}

export interface CustomerInfoProps {
    value?: Partial<CustomerInfoFormData>;
    onSubmit?: (data: CustomerInfoFormData) => void;
    onGoBack?: () => void;
    isSubmitting?: boolean;
    error?: string;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
