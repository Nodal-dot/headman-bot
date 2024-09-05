import {listHandler, mainHandler, markAbsentHandler, registerHandler, scheduleHandler,} from 'handlers';
import {MyContext} from 'types/bot';
import {Composer} from 'grammy';
import {settingsHandler} from 'handlers/settings';
import {addStudentHandler} from 'handlers/addStudent';
import {deleteStudentHandler} from 'handlers/deleteStudent';

const composer = new Composer<MyContext>();

composer.hears('📚Журнал', registerHandler);
composer.hears('➕Добавить', addStudentHandler);
composer.hears('❌Удалить', deleteStudentHandler);
composer.hears('📝Список', listHandler);
composer.hears('✔️Отметить пропуск', markAbsentHandler);
composer.hears('📋Меню', mainHandler);
composer.hears('🕒Расписание', scheduleHandler);
composer.hears('⚙️Настройки', settingsHandler);
export { composer as hears };
