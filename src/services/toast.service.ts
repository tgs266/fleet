import { IToastProps, Position, Toaster as BPToaster } from '@blueprintjs/core';

const Toaster = BPToaster.create({
    className: 'recipe-toaster',
    position: Position.TOP,
});

export const showToastWithActionInterval = (props: IToastProps, time: number, action: any) => {
    const key = Toaster.show({ ...props, className: 'toast' });
    setTimeout(() => {
        Toaster.dismiss(key);
        action();
    }, time);
};

export default Toaster;
