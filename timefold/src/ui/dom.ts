/** Fail at the missing markup contract instead of later dereferencing null. */
export function requireElement<ElementType extends Element = HTMLElement>(
  selector: string,
  parent: ParentNode = document,
): ElementType {
  const element = parent.querySelector<ElementType>(selector);
  if (!element) throw new Error(`Missing interface element: ${selector}`);
  return element;
}

/** Capture permanent shell elements once; replaceable detail DOM is separate. */
export function collectInterfaceElements() {
  const timeline = requireElement<HTMLElement>(".timeline");
  const archiveDialog = requireElement<HTMLDialogElement>("#archive-dialog");
  return {
    canvas: requireElement<HTMLCanvasElement>("#world"),
    brand: requireElement<HTMLAnchorElement>(".brand"),
    archiveButton: requireElement<HTMLButtonElement>("#archive-open"),
    fallbackButton: requireElement<HTMLButtonElement>("#fallback-index"),
    backButton: requireElement<HTMLButtonElement>("#back-index"),
    aboutButton: requireElement<HTMLButtonElement>("#about-open"),
    exploreButton: requireElement<HTMLButtonElement>("#explore"),
    motionButton: requireElement<HTMLButtonElement>("#motion"),
    soundButton: requireElement<HTMLButtonElement>("#sound"),
    soundLabel: requireElement<HTMLElement>(".sound-label"),
    archiveDialog,
    detailDialog: requireElement<HTMLDialogElement>("#detail-dialog"),
    aboutDialog: requireElement<HTMLDialogElement>("#about-dialog"),
    detailContent: requireElement<HTMLElement>("#detail-content"),
    closeButtons: [...document.querySelectorAll<HTMLButtonElement>("button[data-close]")],
    eraButtons: [...timeline.querySelectorAll<HTMLButtonElement>("button[data-era]")],
    objectRows: [...archiveDialog.querySelectorAll<HTMLButtonElement>("button[data-object]")].map((button) => ({
      button,
      name: requireElement<HTMLElement>("strong", button),
      form: requireElement<HTMLElement>("small", button),
    })),
    timeInput: requireElement<HTMLInputElement>("#time"),
    timeYear: requireElement<HTMLElement>("#time-year"),
    roomNumber: requireElement<HTMLElement>("#room-number"),
    eraName: requireElement<HTMLElement>("#era-name"),
    eraNote: requireElement<HTMLElement>("#era-note"),
    travellerReadout: requireElement<HTMLElement>("#traveller-readout"),
    spectralLabel: requireElement<HTMLElement>("#spectral-label"),
    phaseLabel: requireElement<HTMLElement>("#phase-label"),
    previousButton: requireElement<HTMLButtonElement>("#prev-era"),
    nextButton: requireElement<HTMLButtonElement>("#next-era"),
    announcement: requireElement<HTMLElement>("#announcement"),
    tooltip: requireElement<HTMLElement>("#tooltip"),
    loading: requireElement<HTMLElement>("#loading"),
    fallback: requireElement<HTMLElement>("#fallback"),
    themeColor: document.querySelector<HTMLMetaElement>('meta[name="theme-color"]'),
  };
}

export type InterfaceElements = ReturnType<typeof collectInterfaceElements>;
