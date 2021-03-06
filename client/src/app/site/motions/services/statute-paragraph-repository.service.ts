import { Injectable } from '@angular/core';
import { DataSendService } from '../../../core/services/data-send.service';
import { DataStoreService } from '../../../core/services/data-store.service';
import { BaseRepository } from '../../base/base-repository';
import { ViewStatuteParagraph } from '../models/view-statute-paragraph';
import { StatuteParagraph } from '../../../shared/models/motions/statute-paragraph';
import { Identifiable } from '../../../shared/models/base/identifiable';
import { CollectionStringModelMapperService } from '../../../core/services/collectionStringModelMapper.service';

/**
 * Repository Services for statute paragraphs
 *
 * Rather than manipulating models directly, the repository is meant to
 * inform the {@link DataSendService} about changes which will send
 * them to the Server.
 */
@Injectable({
    providedIn: 'root'
})
export class StatuteParagraphRepositoryService extends BaseRepository<ViewStatuteParagraph, StatuteParagraph> {
    /**
     * Creates a StatuteParagraphRepository
     * Converts existing and incoming statute paragraphs to ViewStatuteParagraphs
     * Handles CRUD using an observer to the DataStore
     * @param DataSend
     */
    public constructor(
        DS: DataStoreService,
        mapperService: CollectionStringModelMapperService,
        private dataSend: DataSendService
    ) {
        super(DS, mapperService, StatuteParagraph);
    }

    protected createViewModel(statuteParagraph: StatuteParagraph): ViewStatuteParagraph {
        return new ViewStatuteParagraph(statuteParagraph);
    }

    public async create(statuteParagraph: StatuteParagraph): Promise<Identifiable> {
        return await this.dataSend.createModel(statuteParagraph);
    }

    public async update(
        statuteParagraph: Partial<StatuteParagraph>,
        viewStatuteParagraph: ViewStatuteParagraph
    ): Promise<void> {
        const updateParagraph = viewStatuteParagraph.statuteParagraph;
        updateParagraph.patchValues(statuteParagraph);
        await this.dataSend.updateModel(updateParagraph);
    }

    public async delete(viewStatuteParagraph: ViewStatuteParagraph): Promise<void> {
        await this.dataSend.deleteModel(viewStatuteParagraph.statuteParagraph);
    }
}
