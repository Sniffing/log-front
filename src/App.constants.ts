import { pageConfigs } from './pages/page.constants';

export class Constants {
    public static pageConfigs = pageConfigs;
    public static DATABASE_URL='http://localhost:3000';
    public static LOG_ENTRY_URL=`${Constants.DATABASE_URL}/logEntries`;
    public static LIFE_EVENT_URL=`${Constants.DATABASE_URL}/lifeEvents`;
    public static CALORIE_ENTRY_URL=`${Constants.DATABASE_URL}/calories`;
}