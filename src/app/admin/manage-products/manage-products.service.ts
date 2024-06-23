import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ManageProductsService extends ApiService {
  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config',
      );
      return EMPTY;
    }

    const authorizationToken = localStorage.getItem('authorization_token');

    return this.getPreSignedUrl(file.name, authorizationToken).pipe(
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
          },
        }),
      ),
    );
  }

  private getPreSignedUrl(
    fileName: string,
    authorizationToken: string | null,
  ): Observable<string> {
    const url = this.getUrl('import', 'import');
    const options = {
      params: {
        name: fileName,
      },
      headers: {},
    };

    if (authorizationToken) {
      options.headers = {
        Authorization: `Basic ${authorizationToken}`,
      };
    }

    return this.http.get<string>(url, options);
  }
}
