'use client';
import Header from '../Header';
import { useEffect, useRef } from 'react';
import SectionHeader from '../SectionHeader';

export default function Home() {
  const formInitialized = useRef(false);

  useEffect(() => {
    // Only proceed if the form hasn't been initialized yet
    if (!formInitialized.current) {
      const scriptId = 'hubspot-form-script';

      const loadHubSpotScript = () => {
        // Avoid multiple injections of the script
        if (document.getElementById(scriptId)) {
          // Script is already loaded; directly initialize the form
          initializeHubSpotForm();
          return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = '//js.hsforms.net/forms/embed/v2.js';
        script.charset = 'utf-8';
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
          initializeHubSpotForm();
        };
        document.body.appendChild(script);
      };

      const initializeHubSpotForm = () => {
        if (window.hbspt && !formInitialized.current) {
          window.hbspt.forms.create({
            region: 'na1',
            portalId: '45639015',
            formId: 'c82c88cd-b6ab-4a9d-9b5a-2b5313ff67ee',
            target: '#hubspotForm',
          });
          // Mark the form as initialized to prevent re-initialization
          formInitialized.current = true;
        }
      };

      loadHubSpotScript();
    }
  }, []);

  return (
    <>
      <Header />

      <main>
        <div className="space-y-16 py-48 xl:space-y-20">
          {/* Recent activity table */}
          <div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Recent activity table */}
              <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:px-6">
                  <SectionHeader text="Contact Us" />
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div id="hubspotForm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
