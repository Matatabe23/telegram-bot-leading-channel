export const bodyLock = (boolean: boolean) => {
    if (boolean) {
        document.body.classList.remove('overflow-hidden');
        document.body.classList.add('overflow-y-scroll');
        document.body.style.paddingRight = '';
    } else {
        document.body.classList.add('overflow-hidden');
        document.body.classList.remove('overflow-y-scroll');
        document.body.style.paddingRight = `5px`;
    }
};
