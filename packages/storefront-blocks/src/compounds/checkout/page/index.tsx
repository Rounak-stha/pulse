import { Check } from 'lucide-react';
import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import {
    backgroundClasses,
    borderClasses,
    containerSizeClasses,
    gapClasses,
    spacingClasses,
    stepLabels,
    stepOrder,
} from './constants/styles.js';
import { CheckoutPageRuntimeProps, CheckoutStep } from './types.js';

const FLOW_STEPS: CheckoutStep[] = [
    'ORDER_SUMMARY',
    'CUSTOMER_INFO',
    'SHIPPING_ADDRESS',
    'SHIPPING_METHOD',
    'PAYMENT',
];

export const CheckoutPage: FC<CheckoutPageRuntimeProps> = ({
    OrderSummarySlot,
    CustomerInfoSlot,
    ShippingAddressSlot,
    ShippingMethodSlot,
    PaymentSlot,
    ConfirmationSlot,
    SlotFlexibleZone,
    ref,
    selected,
    layout,
    spacing,
    backgroundColor,
    borderStyle,
    containerSize,
    step,
    onStepChange,
    order,
}) => {
    const currentStepIndex = stepOrder.indexOf(step);

    const renderStep = () => {
        console.log('Rendering step:', step);
        switch (step) {
            case 'ORDER_SUMMARY':
                return OrderSummarySlot;
            case 'CUSTOMER_INFO':
                return CustomerInfoSlot;
            case 'SHIPPING_ADDRESS':
                return ShippingAddressSlot;
            case 'SHIPPING_METHOD':
                return ShippingMethodSlot;
            case 'PAYMENT':
                return PaymentSlot;
            case 'CONFIRMATION':
                return ConfirmationSlot;
            default:
                return null;
        }
    };

    const showSidebar = layout === 'with-sidebar' && step !== 'ORDER_SUMMARY' && step !== 'CONFIRMATION';

    if (step === 'CONFIRMATION') {
        return (
            <div
                ref={ref}
                className={cn(
                    'transition-all duration-200 mx-auto',
                    containerSizeClasses[containerSize],
                    spacingClasses[spacing],
                    selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                )}
            >
                {ConfirmationSlot}
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-200 mx-auto',
                containerSizeClasses[containerSize],
                spacingClasses[spacing],
                selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            )}
        >
            {/* Progress Stepper */}
            <nav className="mb-10">
                <ol className="flex items-center justify-between">
                    {FLOW_STEPS.map((s, i) => {
                        const isCompleted = i < currentStepIndex;
                        const isActive = s === step;
                        const isUpcoming = i > currentStepIndex;
                        return (
                            <li key={s} className="flex flex-1 items-center">
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <div className="flex items-center w-full">
                                        {i > 0 && (
                                            <div
                                                className={cn(
                                                    'h-px flex-1 transition-colors duration-300',
                                                    isCompleted || isActive ? 'bg-primary' : 'bg-border',
                                                )}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                console.log('Step change requested:', s);
                                                onStepChange?.(s);
                                            }}
                                            disabled={false}
                                            className={cn(
                                                'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                                                isCompleted &&
                                                    'bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 shadow-md',
                                                isActive &&
                                                    'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg scale-110',
                                                isUpcoming &&
                                                    'bg-muted text-muted-foreground border-2 border-border',
                                            )}
                                        >
                                            {isCompleted ? <Check className="h-5 w-5" /> : i + 1}
                                        </button>
                                        {i < FLOW_STEPS.length - 1 && (
                                            <div
                                                className={cn(
                                                    'h-px flex-1 transition-colors duration-300',
                                                    isCompleted ? 'bg-primary' : 'bg-border',
                                                )}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            'text-xs font-medium transition-colors hidden sm:block',
                                            isActive && 'text-primary font-semibold',
                                            isCompleted && 'text-foreground',
                                            isUpcoming && 'text-muted-foreground',
                                        )}
                                    >
                                        {stepLabels[s]}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* Main Content */}
            <div className={cn(showSidebar ? 'grid grid-cols-1 lg:grid-cols-3' : '', gapClasses[spacing])}>
                <div className={cn(showSidebar && 'lg:col-span-2')}>
                    <div
                        key={step}
                        className={cn(
                            backgroundClasses[backgroundColor],
                            borderClasses[borderStyle],
                            borderStyle !== 'none' && 'p-6 md:p-8',
                        )}
                    >
                        {renderStep()}
                    </div>
                </div>

                {showSidebar && OrderSummarySlot && (
                    <div className="lg:col-span-1">
                        <div
                            className={cn(
                                'lg:sticky lg:top-4',
                                backgroundClasses[backgroundColor],
                                borderClasses[borderStyle],
                                borderStyle !== 'none' && 'p-6',
                            )}
                        >
                            {OrderSummarySlot}
                        </div>
                    </div>
                )}
            </div>

            {SlotFlexibleZone && (
                <div className={cn('w-full mt-8', gapClasses[spacing])}>{SlotFlexibleZone}</div>
            )}
        </div>
    );
};
