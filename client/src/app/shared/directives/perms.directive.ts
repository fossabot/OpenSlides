import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { OperatorService, Permission } from 'app/core/services/operator.service';
import { OpenSlidesComponent } from 'app/openslides.component';

/**
 * Directive to check if the {@link OperatorService} has the correct permissions to access certain functions
 *
 * Successor of os-perms in OpenSlides 2.2
 * @example <div *osPerms="'perm'" ..> ... < /div>
 * @example <div *osPerms="['perm1', 'perm2']" ..> ... < /div>
 */
@Directive({
    selector: '[osPerms]'
})
export class PermsDirective extends OpenSlidesComponent {
    /**
     * Holds the required permissions the access a feature
     */
    private permissions: Permission[] = [];

    /**
     * Holds the value of the last permission check. Therefore one can check, if the
     * permission has changes, to save unnecessary view updates, if not.
     */
    private lastPermissionCheckResult = false;

    /**
     * Alternative to the permissions. Used in special case where a combination
     * with *ngIf would be required.
     *
     * # Example:
     *
     * The div will render if the permission `user.can_manage` is set
     * or if `this.ownPage` is `true`
     * ```html
     * <div *osPerms="'users.can_manage';or:ownPage"> something </div>
     * ```
     */
    private alternative: boolean;

    /**
     * Switch, to invert the result of checkPermission. Usefull for using osPerms as if-else:
     * For one element you can use `*osPerms="'perm'"` and for the else-element use
     * `*osPerms="'perm';complement: true"`.
     */
    private complement: boolean;

    /**
     * Constructs the directive once. Observes the operator for it's groups so the
     * directive can perform changes dynamically
     *
     * @param template inner part of the HTML container
     * @param viewContainer outer part of the HTML container (for example a `<div>`)
     * @param operator OperatorService
     */
    public constructor(
        private template: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private operator: OperatorService
    ) {
        super();

        // observe groups of operator, so the directive can actively react to changes
        this.operator.getObservable().subscribe(content => {
            this.updateView();
        });
    }

    /**
     * Comes directly from the view.
     * The value defines the requires permissions as an array or a single permission.
     */
    @Input()
    public set osPerms(value: string | string[]) {
        if (!value) {
            value = [];
        } else if (typeof value === 'string') {
            value = [value];
        }
        this.permissions = value;
        this.updateView();
    }

    /**
     * Comes from the view.
     * `;or:` turns into osPermsOr during runtime.
     */
    @Input('osPermsOr')
    public set osPermsAlt(value: boolean) {
        this.alternative = value;
        this.updateView();
    }

    /**
     * COmes from the view.
     */
    @Input('osPermsComplement')
    public set osPermsComplement(value: boolean) {
        this.complement = value;
        this.updateView();
    }

    /**
     * Shows or hides certain content in the view.
     */
    private updateView(): void {
        const hasPerms = this.checkPermissions();
        const permsChanged = hasPerms !== this.lastPermissionCheckResult;

        if ((hasPerms && permsChanged) || this.alternative) {
            // clean up and add the template
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.template);
        } else if (!hasPerms) {
            // will remove the content of the container
            this.viewContainer.clear();
        }
        this.lastPermissionCheckResult = hasPerms;
    }

    /**
     * Compare the required permissions with the users permissions.
     * Returns true if the users permissions fit.
     */
    private checkPermissions(): boolean {
        const hasPerms = this.permissions.length === 0 || this.operator.hasPerms(...this.permissions);
        if (this.complement) {
            return !hasPerms;
        } else {
            return hasPerms;
        }
    }
}
