import { browser, element, by, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of Events';
const expectedTitle = `${expectedH1}`;
const targetEvent = { id: 15, name: 'Magneta' };
const targetEventDashboardIndex = 3;
const nameSuffix = 'X';
const newEventName = targetEvent.name + nameSuffix;

class Event {
    id: number;
    name: string;

    // Factory methods

    // Get event from s formatted as '<id> <name>'.
    static fromString(s: string): Event {
        return {
            id: +s.substr(0, s.indexOf(' ')),
            name: s.substr(s.indexOf(' ') + 1),
        };
    }

    // Get event id and name from the given detail element.
    static async fromDetail(detail: ElementFinder): Promise<Event> {
        // Get event id from the first <div>
        const id = await detail.all(by.css('div')).first().getText();
        // Get name from the h2
        const name = await detail.element(by.css('h2')).getText();
        return {
            id: +id.substr(id.indexOf(' ') + 1),
            name: name.substr(0, name.lastIndexOf(' '))
        };
    }
}

describe('Tutorial part 5', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topEvents: element.all(by.css('app-root app-dashboard > div h4')),

      appEventsHref: navElts.get(1),
      appEvents: element(by.css('app-root app-events')),
      allEvents: element.all(by.css('app-root app-events li')),
      eventDetail: element(by.css('app-root app-event-detail > div'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
        expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Events'];
    it(`has views ${expectedViewNames}`, () => {
      const viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      const page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top events', () => {
      const page = getPageElts();
      expect(page.topEvents.count()).toEqual(4);
    });

    it(`selects and routes to ${targetEvent.name} details`, dashboardSelectTargetEvent);

    it(`updates event name (${newEventName}) in details view`, updateEventNameInDetailView);

    it(`saves and shows ${newEventName} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      const targetEventElt = getPageElts().topEvents.get(targetEventDashboardIndex);
      expect(targetEventElt.getText()).toEqual(newEventName);
    });

  });

  describe('Events tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Events view', () => {
      getPageElts().appEventsHref.click();
      const page = getPageElts();
      expect(page.appEvents.isPresent()).toBeTruthy();
      expect(page.allEvents.count()).toEqual(10, 'number of events');
    });

    it('can route to event details', async () => {
      getEventLiEltById(targetEvent.id).click();

      const page = getPageElts();
      expect(page.eventDetail.isPresent()).toBeTruthy('shows event detail');
      const event = await Event.fromDetail(page.eventDetail);
      expect(event.id).toEqual(targetEvent.id);
      expect(event.name).toEqual(targetEvent.name.toUpperCase());
    });

    it(`updates event name (${newEventName}) in details view`, updateEventNameInDetailView);

    it(`shows ${newEventName} in Events list`, () => {
      element(by.buttonText('go back')).click();
      const expectedText = `${targetEvent.id} ${newEventName}`;
      expect(getEventLiEltById(targetEvent.id).getText()).toEqual(expectedText);
    });

  });

  async function dashboardSelectTargetEvent() {
    const targetEventElt = getPageElts().topEvents.get(targetEventDashboardIndex);
    expect(targetEventElt.getText()).toEqual(targetEvent.name);
    targetEventElt.click();

    const page = getPageElts();
    expect(page.eventDetail.isPresent()).toBeTruthy('shows event detail');
    const event = await Event.fromDetail(page.eventDetail);
    expect(event.id).toEqual(targetEvent.id);
    expect(event.name).toEqual(targetEvent.name.toUpperCase());
  }

  async function updateEventNameInDetailView() {
    // Assumes that the current view is the event details view.
    addToEventName(nameSuffix);

    const page = getPageElts();
    const event = await Event.fromDetail(page.eventDetail);
    expect(event.id).toEqual(targetEvent.id);
    expect(event.name).toEqual(newEventName.toUpperCase());
  }

});

function addToEventName(text: string): promise.Promise<void> {
  const input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    const hTag = `h${hLevel}`;
    const hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
}

function getEventLiEltById(id: number) {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}
