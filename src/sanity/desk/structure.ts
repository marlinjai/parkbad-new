import { StructureBuilder } from 'sanity/structure';
import { EnvelopeIcon } from '@sanity/icons';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Kontakt-Anfragen')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Kontakt-Anfragen')
            .items([
              S.listItem()
                .title('Offen')
                .child(
                  S.documentList()
                    .title('Offen')
                    .filter('_type == "contactSubmission" && status == "offen"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('In Bearbeitung')
                .child(
                  S.documentList()
                    .title('In Bearbeitung')
                    .filter('_type == "contactSubmission" && status == "inBearbeitung"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Erledigt')
                .child(
                  S.documentList()
                    .title('Erledigt')
                    .filter('_type == "contactSubmission" && status == "erledigt"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Alle')
                .child(
                  S.documentList()
                    .title('Alle Kontakt-Anfragen')
                    .filter('_type == "contactSubmission"')
                    .defaultOrdering([{ field: 'receivedAt', direction: 'desc' }])
                ),
            ])
        ),
      S.divider(),
      // Auto-list all other document types except mediaTag and contactSubmission
      ...S.documentTypeListItems().filter(item => {
        const id = item.getId();
        return id !== 'mediaTag' && id !== 'contactSubmission';
      }),
    ]);
