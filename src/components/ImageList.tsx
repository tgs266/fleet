/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/no-unstable-nested-components */
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import * as React from 'react';
import { ContainerSpec } from '../models/container.model';
import { Image } from '../models/image.model';
import K8 from '../services/k8.service';

const ImageSuggest = Suggest.ofType<Image>();

export default function ImageList(props: {
    containerSpec: ContainerSpec;
    imageList?: Image[];
    onChange: (path: string, value: any) => void;
}) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    let val = [] as Image[];
    if (props.imageList) {
        val = props.imageList;
    }
    const [images, setImages] = React.useState(val);
    if (!props.imageList) {
        React.useEffect(() => {
            K8.images.getImages().then((r) => {
                setImages(r.data);
            });
        }, []);
    }

    return (
        <ImageSuggest
            fill
            selectedItem={props.containerSpec.image}
            items={images}
            inputValueRenderer={(item) => `${item.name}:${item.tag}`}
            itemRenderer={(item, itemProps) => {
                if (!itemProps.modifiers.matchesPredicate) {
                    return null;
                }
                return (
                    <MenuItem
                        active={itemProps.modifiers.active}
                        disabled={itemProps.modifiers.disabled}
                        key={item.name + item.tag}
                        onClick={itemProps.handleClick}
                        text={item.name}
                        label={item.tag}
                    />
                );
            }}
            createNewItemFromQuery={(query) => ({
                name: query.split(':')[0],
                tag: query.split(':')[1],
            })}
            itemPredicate={(query, item, index, exactMatch) => {
                const normalizedTitle = `${item.name}:${item.tag}`.toLowerCase();
                const normalizedQuery = query.toLowerCase();

                if (exactMatch) {
                    return normalizedTitle === normalizedQuery;
                }
                return `${item.name}:${item.tag}`.indexOf(normalizedQuery) >= 0;
            }}
            createNewItemRenderer={(query, active, handleClick) => {
                if (query.includes(':')) {
                    const item = {
                        name: query.split(':')[0],
                        tag: query.split(':')[1],
                    };
                    return (
                        <MenuItem
                            active={active}
                            key={item.name + item.tag}
                            onClick={handleClick}
                            text={item.name}
                            label={item.tag}
                        />
                    );
                }
                return null;
            }}
            onItemSelect={(item) => {
                props.onChange('image', item);
            }}
        />
    );
}
