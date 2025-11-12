import { Element, useNode } from '@craftjs/core';
import { ComponentProps } from 'react';

import {
    DeafultBadgeProps,
    DefaultButtonProps,
    DefaultHeadlineProps,
    DefaultSubTextProps,
} from '@/builder-blocks/atoms/index.js';
import { DefaultHeroBannerProps, HeroBanner as HeroBannerPure } from '@/builder-blocks/compounds/index.js';

import { Badge } from '@/vdb/components/builder/blocks/atoms/badge/index.js';
import { Button } from '@/vdb/components/builder/blocks/atoms/button/index.js';
import { Headline } from '@/vdb/components/builder/blocks/atoms/headline/index.js';
import { SubText } from '@/vdb/components/builder/blocks/atoms/sub-text/index.js';

import { HeroBannerSettings } from './settings.js';

type HeroBannerProps = ComponentProps<typeof HeroBannerPure>;

export const HeroBanner: React.FC<HeroBannerProps> = props => {
    const {
        connectors: { connect, drag },
        selected,
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <HeroBannerPure
            {...props}
            ref={(ref: HTMLDivElement) => {
                connect(drag(ref));
            }}
            selected={selected}
            SlotHeadline={<Element id="headline" is={Headline} {...DefaultHeadlineProps} />}
            SlotBadge={<Element id="badge" is={Badge} {...DeafultBadgeProps} canvas />}
            SlotSubtext={<Element id="subtext" is={SubText} {...DefaultSubTextProps} />}
            SlotButton={<Element id="button" is={Button} {...DefaultButtonProps} />}
        />
    );
};

(HeroBanner as any).craft = {
    displayName: 'Hero Banner',
    props: DefaultHeroBannerProps,
    related: { settings: HeroBannerSettings },
};
