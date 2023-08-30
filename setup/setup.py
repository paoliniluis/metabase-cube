import requests, os

# Authentication

host = os.environ.get('host') if os.environ.get('host') else 'http://localhost'
port = os.environ.get('port') if os.environ.get('port') else '3001'
healthCheckEndpoint = f'{host}:{port}/api/health'
properties = f'{host}:{port}/api/session/properties'
setup = f'{host}:{port}/api/setup'
database = f'{host}:{port}/api/database'

session = requests.Session()

def health():
    response = session.get(healthCheckEndpoint, verify=False)
    if response.json()['status'] == 'ok':
        return 'healthy'
    else:
        health()

if health() == 'healthy':
    token = session.get(properties, verify=False).json()['setup-token']
    setupPayload = {
        'token':f'{token}',
        'user':{
            'first_name':'a',
            'last_name':'b',
            'email':'a@b.com',
            'site_name':'metabot1',
            'password':'metabot1',
            'password_confirm':'metabot1'
        },
        'database':None,
        'invite':None,
        'prefs':{
            'site_name':'metabot1',
            'site_locale':'en',
            'allow_tracking':False
        }
    }
    try:
        sessionToken = session.post(setup, verify=False, json=setupPayload).json()['id']

        # Add new db's
        postgres_sample_15_cube = {
            'engine':'postgres',
            'name':'cubejs',
            'details': {
                'host':'cubejs',
                'port':'5432',
                'dbname':'db@cubejs',
                'user':'myusername',
                'password':'mypassword',
                'schema-filters-type':'all',
                'ssl':False,
                'tunnel-enabled':False,
                'advanced-options':False
            },
            'is_full_sync':True
        }

        postgres_sample_15_sample = {
            'engine':'postgres',
            'name':'sample_db_postgres',
            'details': {
                'host':'postgres-data-cubejs',
                'port':'5432',
                'dbname':'sample',
                'user':'metabase',
                'password':'metasample123',
                'schema-filters-type':'all',
                'ssl':False,
                'tunnel-enabled':False,
                'advanced-options':False
            },
            'is_full_sync':True
        }


        session.post(database, verify=False, json=postgres_sample_15_cube)
        session.post(database, verify=False, json=postgres_sample_15_sample)
        
        # delete the sample DB
        session.delete(f'{database}/1')

    except:
        exit()