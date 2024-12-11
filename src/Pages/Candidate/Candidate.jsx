import { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

function getAbout(json) {
  const aboutComponent = json?.included?.find((d) =>
    d.entityUrn?.includes("ABOUT")
  );
  return aboutComponent?.topComponents?.[1]?.components?.textComponent?.text
    ?.text;
}

function getExperience(json) {
  const experienceEntity = json?.included?.find(
    (d) =>
      !d?.entityUrn?.includes("VOLUNTEERING_EXPERIENCE") &&
      d?.entityUrn?.includes("EXPERIENCE")
  );

  return experienceEntity?.topComponents?.[1].components?.fixedListComponent?.components?.map(
    (e) => {
      const entity = e?.components?.entityComponent;
      return {
        title: entity?.title?.text,
        companyName: entity?.subtitle?.text,
        description:
          entity?.subComponents?.components?.[0]?.components?.fixedListComponent
            ?.components?.[0]?.components?.textComponent?.text?.text,
        dates: entity?.caption?.text,
        location: entity?.metadata?.text,
        companyUrl: entity?.image?.actionTarget,
      };
    }
  );
}

function getVolunteering(json) {
  const volunteeringEntity = json?.included?.find((d) =>
    d?.entityUrn?.includes("VOLUNTEERING_EXPERIENCE")
  );

  if (volunteeringEntity?.topComponents.length === 0) {
    return [];
  }

  return volunteeringEntity?.topComponents?.[1]?.components?.fixedListComponent?.components?.map(
    (e) => {
      const entity = e?.components?.entityComponent;
      return {
        title: entity?.title?.text,
        companyName: entity?.subtitle?.text,
        description:
          entity?.subComponents?.components?.[0]?.components?.textComponent
            ?.text?.text,
        dates: entity?.caption?.text,
        location: entity?.metadata?.text,
        companyUrl: entity?.image?.actionTarget,
      };
    }
  );
}

function getEducation(json) {
  const educationComponent = json?.included?.find((d) => {
    return d?.entityUrn?.includes("EDUCATION");
  });

  if (educationComponent?.topComponents.length === 0) {
    return [];
  }

  return educationComponent?.topComponents?.[1]?.components?.fixedListComponent?.components?.map(
    (e) => {
      const entity = e?.components?.entityComponent;
      return {
        schoolName: entity?.title?.text,
        degree: entity?.subtitle?.text,
        description:
          entity?.subComponents?.components?.[0]?.components?.insightComponent
            ?.text?.text?.text,
        dates: entity?.caption?.text,
        schoolUrl: entity?.image?.actionTarget,
      };
    }
  );
}

function getLocation(json) {
  const locationComponent = json?.included?.find(
    (d) =>
      !d?.entityUrn?.includes("VOLUNTEERING_EXPERIENCE") &&
      d?.entityUrn?.includes("EXPERIENCE")
  );
  return locationComponent?.topComponents[1]?.components?.fixedListComponent
    ?.components?.[1]?.components?.entityComponent?.metadata?.text;
}

async function getMiddleProfile(profileId) {
  try {
    const cookieStringify = JSON.stringify(
      'bcookie="v=2&bf3e7d24-d58c-41ab-8df9-8a7e3fcd9411"; li_sugr=a263a4bb-8e03-443b-8ec6-65ad55f2aa61; bscookie="v=1&202407010652063b907273-9fce-45c1-8b83-daecdcd02cb3AQGXShpD6hak-GU5ngXd7jF8IWEXlcnT"; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; g_state={"i_p":1729487123838,"i_l":2}; at_check=true; s_cc=true; li_rm=AQG-UjtKHG7ZAQAAAZOp_vYil6_qGh3sFjUaJtb8ydGuV9JExJGV7bTTCGs2_vj-mufKYIo_xarI3uqfrrsGWyAyJsxS0RQ-sqgf81DAk3eaBxJSV_JSpqE9; aam_uuid=60061231704984291484414409296062444237; li_at=AQEDATLvYnoAFH6WAAABk6n_V-MAAAGTzgvb41YAPP-dd21NdyxxAHZFyZsYR4YffBE3vbQ8tJVvy-UalaQe3OqJaxIRWKoEw209jWzWja2WEj2gROFv3wjDtS10xOY5bgeknAU0O5veJrxz4QWtAMot; liap=true; JSESSIONID="ajax:4653718774298036750"; s_sq=%5B%5BB%5D%5D; timezone=Asia/Dhaka; li_theme=light; li_theme_set=app; AnalyticsSyncHistory=AQL2QMHAXNDIpgAAAZOqFXtlZXeoatoh-QcxGbmaYA3T0MIa6sZdR0KwnuNNG5FIxNcQZr5sFltXC-I_YzVvyw; _guid=d8ca352c-a174-49fb-9421-7b7407ce521b; lms_ads=AQE1BYsJeuPgFgAAAZOqFXylPcscfoF0Noo_hUior_czerjyr4xw-wYUbIBaJ8kmSq_Wbvid3Bl-lNP7PJxINoHsnM5w3rBF; lms_analytics=AQE1BYsJeuPgFgAAAZOqFXylPcscfoF0Noo_hUior_czerjyr4xw-wYUbIBaJ8kmSq_Wbvid3Bl-lNP7PJxINoHsnM5w3rBF; dfpfpt=653b9142f4fd4fdfa81ce5fe8aa6e83d; _gcl_au=1.1.262436073.1733725356; fptctx2=taBcrIH61PuCVH7eNCyH0J9Fjk1kZEyRnBbpUW3FKs%252fujI5A03%252bE3P7vOJ74nbbalvFJVMcd3nQHnbjyVME1wTw3rwLKMQRAbihifxa0xU%252baLF78%252bFE7nDYDUX7aDVJi11eztsD6sEc5yh5YqgmSt%252bHQ7KMJ%252fOB47j5fPboQpOM9DPt381y%252bGY1rJt810ozY60iYs4y%252bc6xPFX%252fFLSMkqgv37Um%252fzMg5uzep%252f%252fHOz7ZcoudCWENrGmxCgwRB7Oah%252fNzcaGIr1wLT9zhSNdSl0zVzt5FSOZWY6YOUnIn%252fV6UJ1eXHI1meEngxnjsBN5ONjNsW%252bBUKyKAjZHcRE6ZHV03Qi5%252bqi46Z%252bLUPPrILMpk%253d; _uetsid=83b6fe60b5f211efbfac47d02631a5b8; _uetvid=83b74f00b5f211efa2200b886749fa01; gpv_pn=addtoprofile.linkedin.com%2F; s_tslv=1733824343200; s_ips=687.6666717529297; mbox=PC#d56dedc583394d92b8df4f37e46111e6.38_0#1749376344|session#afc7384d637e427ab5369e2647717f02#1733826204; s_plt=3.20; s_pltp=addtoprofile.linkedin.com%2F; s_tp=5827; s_ppv=addtoprofile.linkedin.com%2F%2C30%2C12%2C1751%2C3%2C10; SID=f16f1f5c-f600-42b6-b527-237c670bbb97; VID=V_2024_12_10_09_11018190; PLAY_LANG=en; lang=v=2&lang=en-US; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiI0N2RiNTgwZC1lNTE2LTQxOTktYjU4Ni04ODcwMjgxNDlhN2N8MTczMzgyNDgzMCIsImFsbG93bGlzdCI6Int9IiwicmVjZW50bHktc2VhcmNoZWQiOiIiLCJyZWZlcnJhbC11cmwiOiJodHRwczovL3d3dy5saW5rZWRpbi5jb20vaGVscC9saW5rZWRpbi9hbnN3ZXIvYTUxOTk0Ny90aGlyZC1wYXJ0eS1hcHBsaWNhdGlvbnMtZGF0YS11c2U_bGFuZz1lbiIsInJlY2VudGx5LXZpZXdlZCI6IiIsIkNQVC1pZCI6Il7CoMONw4vClsOOIFxiLsKCw6lcdTAwMDMmwqU-w4QiLCJmbG93VHJhY2tpbmdJZCI6IjdSVG1SVUdGUjQySGFKNDloSkdlOVE9PSIsImV4cGVyaWVuY2UiOiIiLCJ0cmsiOiIifSwibmJmIjoxNzMzODI0ODMwLCJpYXQiOjE3MzM4MjQ4MzB9._El3cu6q8nvwi3xAr5mqXnYuv4L1R-CZZzKRrayuf-w; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C20067%7CMCMID%7C60227619229846535914434936094664491270%7CMCAAMLH-1734435616%7C3%7CMCAAMB-1734435616%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1733838016s%7CNONE%7CvVersion%7C5.1.1%7CMCCIDH%7C1218120762; UserMatchHistory=AQLidwSJGVwZYwAAAZOwsHqOlDJ94WoRkojfJkNhNO4VWjZSeFzwGBV36QnywOEHuGLn2FUDOoCNzatVoKsITSL-ZtJgQIQ-BMrAXurNrDp3qQhDwwtBcurW0fCnjMZtV60f91qaXJLHVSPTNPYwPRGoZbm_wnsxfaLRnzGANwHVdD6-s-lOK41_dWj22kX3Sqk53oAv4dxaa3yR9v_YvOm5ai3qKYEru1V3vXe2SubzJsOkRK40AhBMfXSmoz2TqUtXJrxWEtVsjkJ5-1bwCi621MmEZhyX9X5E4ucIyymORxGIoIbR269xyrBvmt8nAlXHOlF5HPNu1sAD4kODar5PvBp2o0m7IpFeRkECJJx2Z37uJg; lidc="b=OB14:s=O:r=O:a=O:p=O:g=6039:u=1543:x=1:i=1733836176:t=1733849363:v=2:sig=AQH-2o6eKfhFmGh79OeI3OiJsk7z3j1D"'
    );

    const res = await fetch(
      `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(profileUrn:urn%3Ali%3Afsd_profile%3A${profileId})&&queryId=voyagerIdentityDashProfileCards.2d68c43b54ee24f8de25bc423c3cf7e4`,
      {
        headers: {
          accept: "application/vnd.linkedin.normalized+json+2.1",
          "accept-language": "en-US,en;q=0.9",
          "csrf-token": "ajax:4653718774298036750",
          priority: "u=1, i",
          "sec-ch-prefers-color-scheme": "light",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-li-lang": "en_US",
          "x-li-page-instance":
            "urn:li:page:d_flagship3_profile_view_base;Eo3ulwG5TU6XPA2w5LsmIw==",
          "x-li-pem-metadata":
            "Voyager - Profile=profile-top-card-supplementary",
          "x-li-track":
            '{"clientVersion":"1.13.27533","mpVersion":"1.13.27533","osName":"web","timezoneOffset":6,"timezone":"Asia/Dhaka","deviceFormFactor":"DESKTOP","mpName":"voyager-web","displayDensity":1.5,"displayWidth":1920,"displayHeight":1080}',
          "x-restli-protocol-version": "2.0.0",
          cookie: cookieStringify,
          Referer: "https://www.linkedin.com/in/heishasib/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    );
    const json = await res.json();

    return {
      location: getLocation(json),
      about: getAbout(json),
      experience: getExperience(json),
      education: getEducation(json),
      volunteering: getVolunteering(json),
    };
  } catch (error) {
    console.log("error at middleProfile", error.message);
  }
}

async function getTopProfile(handle) {
  try {
    const cookieStringify = {
      bcookie: "v=2&bf3e7d24-d58c-41ab-8df9-8a7e3fcd9411",
      li_sugr: "a263a4bb-8e03-443b-8ec6-65ad55f2aa61",
      bscookie:
        "v=1&202407010652063b907273-9fce-45c1-8b83-daecdcd02cb3AQGXShpD6hak-GU5ngXd7jF8IWEXlcnT",
      "AMCVS_14215E3D5995C57C0A495C55@AdobeOrg": "1",
      g_state: '{"i_p":1729487123838,"i_l":2}',
      at_check: "true",
      s_cc: "true",
      li_rm:
        "AQG-UjtKHG7ZAQAAAZOp_vYil6_qGh3sFjUaJtb8ydGuV9JExJGV7bTTCGs2_vj-mufKYIo_xarI3uqfrrsGWyAyJsxS0RQ-sqgf81DAk3eaBxJSV_JSpqE9",
      aam_uuid: "60061231704984291484414409296062444237",
      li_at:
        "AQEDATLvYnoAFH6WAAABk6n_V-MAAAGTzgvb41YAPP-dd21NdyxxAHZFyZsYR4YffBE3vbQ8tJVvy-UalaQe3OqJaxIRWKoEw209jWzWja2WEj2gROFv3wjDtS10xOY5bgeknAU0O5veJrxz4QWtAMot",
      liap: "true",
      JSESSIONID: "ajax:4653718774298036750",
      s_sq: "[[B]]",
      timezone: "Asia/Dhaka",
      li_theme: "light",
      li_theme_set: "app",
      AnalyticsSyncHistory:
        "AQL2QMHAXNDIpgAAAZOqFXtlZXeoatoh-QcxGbmaYA3T0MIa6sZdR0KwnuNNG5FIxNcQZr5sFltXC-I_YzVvyw",
      _guid: "d8ca352c-a174-49fb-9421-7b7407ce521b",
      lms_ads:
        "AQE1BYsJeuPgFgAAAZOqFXylPcscfoF0Noo_hUior_czerjyr4xw-wYUbIBaJ8kmSq_Wbvid3Bl-lNP7PJxINoHsnM5w3rBF",
      lms_analytics:
        "AQE1BYsJeuPgFgAAAZOqFXylPcscfoF0Noo_hUior_czerjyr4xw-wYUbIBaJ8kmSq_Wbvid3Bl-lNP7PJxINoHsnM5w3rBF",
      dfpfpt: "653b9142f4fd4fdfa81ce5fe8aa6e83d",
      _gcl_au: "1.1.262436073.1733725356",
      fptctx2:
        "taBcrIH61PuCVH7eNCyH0J9Fjk1kZEyRnBbpUW3FKs%252fujI5A03%252bE3P7vOJ74nbbalvFJVMcd3nQHnbjyVME1wTw3rwLKMQRAbihifxa0xU%252baLF78%252bFE7nDYDUX7aDVJi11eztsD6sEc5yh5YqgmSt%252bHQ7KMJ%252fOB47j5fPboQpOM9DPt381y%252bGY1rJt810ozY60iYs4y%252bc6xPFX%252fFLSMkqgv37Um%252fzMg5uzep%252f%252fHOz7ZcoudCWENrGmxCgwRB7Oah%252fNzcaGIr1wLT9zhSNdSl0zVzt5FSOZWY6YOUnIn%252fV6UJ1eXHI1meEngxnjsBN5ONjNsW%252bBUKyKAjZHcRE6ZHV03Qi5%252bqi46Z%252bLUPPrILMpk%253d",
      _uetsid: "83b6fe60b5f211efbfac47d02631a5b8",
      _uetvid: "83b74f00b5f211efa2200b886749fa01",
      gpv_pn: "addtoprofile.linkedin.com%2F",
      s_tslv: "1733824343200",
      s_ips: "687.6666717529297",
      mbox: "PC#d56dedc583394d92b8df4f37e46111e6.38_0#1749376344|session#afc7384d637e427ab5369e2647717f02#1733826204",
      s_plt: "3.20",
      s_pltp: "addtoprofile.linkedin.com%2F",
      s_tp: "5827",
      s_ppv: "addtoprofile.linkedin.com%2F%2C30%2C12%2C1751%2C3%2C10",
      SID: "f16f1f5c-f600-42b6-b527-237c670bbb97",
      VID: "V_2024_12_10_09_11018190",
      PLAY_LANG: "en",
      lang: "v=2&lang=en-US",
      PLAY_SESSION:
        "eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiI0N2RiNTgwZC1lNTE2LTQxOTktYjU4Ni04ODcwMjgxNDlhN2N8MTczMzgyNDgzMCIsImFsbG93bGlzdCI6Int9IiwicmVjZW50bHktc2VhcmNoZWQiOiIiLCJyZWZlcnJhbC11cmwiOiJodHRwczovL3d3dy5saW5rZWRpbi5jb20vaGVscC9saW5rZWRpbi9hbnN3ZXIvYTUxOTk0Ny90aGlyZC1wYXJ0eS1hcHBsaWNhdGlvbnMtZGF0YS11c2U_bGFuZz1lbiIsInJlY2VudGx5LXZpZXdlZCI6IiIsIkNQVC1pZCI6Il7CoMONw4vClsOOIFxiLsKCw6lcdTAwMDMmwqU-w4QiLCJmbG93VHJhY2tpbmdJZCI6IjdSVG1SVUdGUjQySGFKNDloSkdlOVE9PSIsImV4cGVyaWVuY2UiOiIiLCJ0cmsiOiIifSwibmJmIjoxNzMzODI0ODMwLCJpYXQiOjE3MzM4MjQ4MzB9._El3cu6q8nvwi3xAr5mqXnYuv4L1R-CZZzKRrayuf-w",
      "AMCV_14215E3D5995C57C0A495C55@AdobeOrg":
        "-637568504|MCIDTS|20067|MCMID|60227619229846535914434936094664491270|MCAAMLH-1734435616|3|MCAAMB-1734435616|RKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y|MCOPTOUT-1733838016s|NONE|vVersion|5.1.1|MCCIDH|1218120762",
      UserMatchHistory:
        "AQLidwSJGVwZYwAAAZOwsHqOlDJ94WoRkojfJkNhNO4VWjZSeFzwGBV36QnywOEHuGLn2FUDOoCNzatVoKsITSL-ZtJgQIQ-BMrAXurNrDp3qQhDwwtBcurW0fCnjMZtV60f91qaXJLHVSPTNPYwPRGoZbm_wnsxfaLRnzGANwHVdD6-s-lOK41_dWj22kX3Sqk53oAv4dxaa3yR9v_YvOm5ai3qKYEru1V3vXe2SubzJsOkRK40AhBMfXSmoz2TqUtXJrxWEtVsjkJ5-1bwCi621MmEZhyX9X5E4ucIyymORxGIoIbR269xyrBvmt8nAlXHOlF5HPNu1sAD4kODar5PvBp2o0m7IpFeRkECJJx2Z37uJg",
      lidc: "b=OB14:s=O:r=O:a=O:p=O:g=6039:u=1543:x=1:i=1733836176:t=1733849363:v=2:sig=AQH-2o6eKfhFmGh79OeI3OiJsk7z3j1D",
    };

    const res = await fetch(
      `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${handle}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.TopCardSupplementary-128`,
      {
        headers: {
          accept: "application/vnd.linkedin.normalized+json+2.1",
          "accept-language": "en-US,en;q=0.9",
          "csrf-token": "ajax:4653718774298036750",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie: cookieStringify,
          Referer: "https://www.linkedin.com/in/heishasib/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );
    const data = await res.json();

    const entityWithAllTheData = data?.included?.find(
      (d) => d?.publicIdentifier && d?.publicIdentifier !== "adrianhorning"
    );
    const thingWithProfileId =
      entityWithAllTheData?.profileStatefulProfileActions?.overflowActions?.find(
        (d) => {
          return d?.report?.authorProfileId;
        }
      );
    return {
      firstName: entityWithAllTheData?.firstName,
      lastName: entityWithAllTheData?.lastName,
      headline: entityWithAllTheData?.headline,
      handle: entityWithAllTheData?.publicIdentifier,
      url: `https://www.linkedin.com/in/${entityWithAllTheData?.publicIdentifier}/`,
      publicIdentifier: entityWithAllTheData?.publicIdentifier,
      profileId: thingWithProfileId?.report?.authorProfileId,
    };
  } catch (error) {
    console.log("error at topProfile", error.message);
  }
}

export async function getLinkedinPage(url) {
  const handle = url.split("/in/")[1].split("/")[0];
  console.log("handle", handle);

  const topProfile = await getTopProfile(handle);
  const middle = await getMiddleProfile(topProfile?.profileId);
  // const recentActivity = await getRecentActivity(topProfile?.profileId);
  const profile = {
    ...topProfile,
    ...middle,
    // recentActivity,
  };
  console.log("profile", profile);
  return profile;
}

const Candidate = () => {
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState(null);
  const [designation, setDesignation] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const response = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const contactInfo = document.querySelector(
            "#top-card-text-details-contact-info"
          );

          if (contactInfo) {
            contactInfo.click();
          }

          return {
            userImage: document.querySelector(
              ".pv-top-card-profile-picture__image--show.evi-image.evi-image"
            )?.src,
            userName: document.querySelector(".v-align-middle.break-words")
              ?.innerText,
            designation: document.querySelector(".text-body-medium")?.innerText,
            userEmail: document.querySelector("a[href^='mailto:']")?.innerText,
            userPhone: document.querySelector(
              ".pv-contact-info__contact-type .list-style-none li span.t-black"
            )?.innerText,
            userAddress: document.querySelector("a[href^='http://maps']")
              ?.innerText,
          };
        },
      });

      const data = response[0].result;
      setUserImage(data.userImage);
      setUserName(data.userName);
      setDesignation(data.designation);
      setUserEmail(data.userEmail);
      setUserPhone(data.userPhone);
      setUserAddress(data.userAddress);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    getLinkedinPage("https://www.linkedin.com/in/heishasib/");
  }, []);

  return (
    <div className="p-2 space-y-4">
      <section className="p-3 border border-blue-700 rounded-md">
        <div className="inline text-blue-700 font-medium text-lg">
          We are checking if this user is in your CRM
        </div>
        <div className="inline-block w-1 h-1 ml-1 bg-blue-700 rounded-full animate-pulse"></div>
        <div className="inline-block w-1 h-1 ml-1 bg-blue-700 rounded-full animate-pulse"></div>
        <div className="inline-block w-1 h-1 ml-1 bg-blue-700 rounded-full animate-pulse"></div>
      </section>

      <div className="space-y-3">
        <div className="flex flex-col items-center gap-2">
          <img src={userImage} alt="" className="w-20 h-20 rounded-full" />
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-900">{userName}</h4>
            <h6 className="font-medium text-gray-700">{designation}</h6>
          </div>
        </div>

        <div className="space-y-2">
          {userEmail && (
            <div className="flex items-center gap-4 p-2 bg-white shadow rounded-md">
              <MdEmail size={16} />
              <p className="text-base">{userEmail}</p>
            </div>
          )}
          {userPhone && (
            <div className="flex items-center gap-4 p-2 bg-white shadow rounded-md">
              <FaPhoneAlt size={16} />
              <p className="text-base">{userPhone}</p>
            </div>
          )}

          {userAddress && (
            <div className="flex items-center gap-4 p-2 bg-white shadow rounded-md">
              <FaLocationDot size={16} />
              <p className="text-base">{userAddress}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidate;
