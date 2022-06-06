import React, { useCallback, useEffect, useState } from 'react';
import http from 'axios';
import { useAuth } from '@syncit/core/hooks';
import { Icon } from '@syncit/core/components';
import Layout from '../../components/layout/layout';

function Calendars() {
  const [calendarsList, setCalendarsList] = useState([]);
  useEffect(() => {
    http.get('/api/calendars/availableCalendars').then(({ data }) => { setCalendarsList(data?.list); });
  }, []);

  return (
    <Layout title="Setting - Calendars">
      <div className="min-w-full p-10">
        <h3 className="font-bold text-2xl">Calendars List</h3>
        <p className="pt-2 pb-5">Description will appear here</p>
        <div className="flex flex-col gap-5">
          {calendarsList.map((account) => (
            <div className="card shadow-xl bg-base-100" key={`account-card-${account.name}`}>
              <div className="card-body">
                <div className="card-title flex justify-between">
                  <h2 className="flex items-center gap-4">
                    <Icon name={account.type} width={40} height={40} />
                    {account.name}
                  </h2>
                  <button type="button" className="btn btn-sm btn-link text-xs">Disconnect</button>
                </div>
                <div className="divider m-0" />
                <div>
                  {account.calendars.map((calendar) => (
                    <div className="flex items-center gap-4 mb-3">
                      <input type="checkbox" className="toggle" />
                      {calendar.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {/*  <div key={`${calendar.externalId}-${key}`}> */}
          {/*    <div className="w-100 flex justify-between"> */}
          {/*      <div>{calendar.name}</div> */}
          {/*      <input type="checkbox" className="toggle" /> */}
          {/*    </div> */}
          {/*    <div className="divider" /> */}
          {/*  </div> */}
          {/* ))} */}
        </div>
      </div>
    </Layout>
  );
}

export default Calendars;
