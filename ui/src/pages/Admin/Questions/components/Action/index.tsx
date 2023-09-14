import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Icon, Modal } from '@/components';
import { changeQuestionStatus, reopenQuestion } from '@/services';
import { useReportModal, useToast } from '@/hooks';

const AnswerActions = ({ itemData, refreshList, curFilter }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'delete' });
  const closeModal = useReportModal(refreshList);
  const toast = useToast();

  const handleAction = (type) => {
    if (type === 'delete') {
      Modal.confirm({
        title: t('title', { keyPrefix: 'delete' }),
        content:
          itemData.answer_count > 0
            ? t('question', { keyPrefix: 'delete' })
            : t('other', { keyPrefix: 'delete' }),
        cancelBtnVariant: 'link',
        confirmBtnVariant: 'danger',
        confirmText: t('delete', { keyPrefix: 'btns' }),
        onConfirm: () => {
          changeQuestionStatus(itemData.id, 'deleted').then(() => {
            refreshList();
          });
        },
      });
    }

    if (type === 'undelete') {
      Modal.confirm({
        title: t('undelete_title'),
        content: t('undelete_desc'),
        cancelBtnVariant: 'link',
        confirmBtnVariant: 'danger',
        confirmText: t('undelete', { keyPrefix: 'btns' }),
        onConfirm: () => {
          changeQuestionStatus(itemData.id, 'available').then(() => {
            refreshList();
          });
        },
      });
    }

    if (type === 'close') {
      closeModal.onShow({
        type: 'question',
        id: itemData.id,
        action: 'close',
      });
    }

    if (type === 'reopen') {
      Modal.confirm({
        title: t('title', { keyPrefix: 'question_detail.reopen' }),
        content: t('content', { keyPrefix: 'question_detail.reopen' }),
        cancelBtnVariant: 'link',
        confirmText: t('confirm_btn', { keyPrefix: 'question_detail.reopen' }),
        onConfirm: () => {
          reopenQuestion({
            question_id: itemData.id,
          }).then(() => {
            toast.onShow({
              msg: t('post_reopen', { keyPrefix: 'messages' }),
              variant: 'success',
            });
            refreshList();
          });
        },
      });
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="link" className="no-toggle p-0">
        <Icon
          name="three-dots-vertical"
          title={t('action', { keyPrefix: 'admin.answers' })}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {curFilter === 'normal' && (
          <Dropdown.Item onClick={() => handleAction('close')}>
            {t('close', { keyPrefix: 'btns' })}
          </Dropdown.Item>
        )}
        {curFilter === 'closed' && (
          <Dropdown.Item onClick={() => handleAction('reopen')}>
            {t('reopen', { keyPrefix: 'btns' })}
          </Dropdown.Item>
        )}
        {curFilter !== 'deleted' ? (
          <Dropdown.Item onClick={() => handleAction('delete')}>
            {t('delete', { keyPrefix: 'btns' })}
          </Dropdown.Item>
        ) : (
          <Dropdown.Item onClick={() => handleAction('undelete')}>
            {t('undelete', { keyPrefix: 'btns' })}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AnswerActions;
