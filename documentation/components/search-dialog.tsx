'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';

/**
 * Dialog de busca customizado para site estatico monolingue.
 *
 * O DefaultSearchDialog injeta o locale do I18nProvider ('pt-BR') nas options
 * do cliente de busca, mas o indice estatico exportado por createFromSource
 * (sem i18n) e registrado na chave "" — o lookup por 'pt-BR' retorna vazio
 * silenciosamente. Este dialog omite o locale para o lookup acertar a chave "".
 */
export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    from: '/advpl-specialist/api/search',
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
