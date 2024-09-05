import {Context, SessionFlavor} from 'grammy';
import {I18nFlavor} from '@grammyjs/i18n';
import {SessionData} from 'bot/session';
import {Conversation, ConversationFlavor} from '@grammyjs/conversations';

export type MyContext = Context &
    I18nFlavor &
    SessionFlavor<SessionData> &
    ConversationFlavor;

export type MyConversation = Conversation<MyContext>;
