import { useEffect, useRef } from "react";

export function useUnsavedChanges(isDirty: boolean) {
    const isDirtyRef = useRef(isDirty);

    useEffect(() => {
        isDirtyRef.current = isDirty;
    }, [isDirty]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirtyRef.current) {
                e.preventDefault();
                e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
                return e.returnValue;
            }
        };

        const handleAnchorClick = (e: MouseEvent) => {
            if (!isDirtyRef.current) return;

            let target = e.target as HTMLElement | null;
            while (target && target.tagName !== "A") {
                target = target.parentElement;
            }

            if (target && target.tagName === "A") {
                const href = target.getAttribute("href");
                if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
                    return;
                }

                const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave without saving?");
                if (!confirmLeave) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("click", handleAnchorClick, true);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("click", handleAnchorClick, { capture: true });
        };
    }, []);
}
